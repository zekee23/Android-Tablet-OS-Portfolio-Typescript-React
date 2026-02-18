import { useState, useCallback, useRef, memo, useEffect } from 'react';
import { Plus, Trash2, Bold, Italic, Underline, Strikethrough, List } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Note {
  id: string;
  content: string;   // Stored as raw HTML (from contentEditable innerHTML)
  timestamp: string; // ISO string — Date objects can't be serialized to JSON
  color: string;     // Key into NOTE_COLORS (e.g. 'amber', 'rose')
}

// The four formats that execCommand + queryCommandState support natively
type FormatType = 'bold' | 'italic' | 'underline' | 'strikeThrough';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// localStorage key — all notes are stored under this single key as a JSON array
const STORAGE_KEY = 'noteswidget_notes';

// Each color has three shades:
//   hex    → saturated color used in the toolbar background
//   light  → soft pastel used as the card background
//   border → darker accent for borders, caret color, and hover states
const NOTE_COLORS = [
  { cls: 'amber',   hex: '#fcd34d', light: '#fef9c3', border: '#d97706' },
  { cls: 'rose',    hex: '#fda4af', light: '#fff1f2', border: '#e11d48' },
  { cls: 'sky',     hex: '#7dd3fc', light: '#f0f9ff', border: '#0284c7' },
  { cls: 'emerald', hex: '#6ee7b7', light: '#ecfdf5', border: '#059669' },
  { cls: 'violet',  hex: '#c4b5fd', light: '#f5f3ff', border: '#7c3aed' },
  { cls: 'orange',  hex: '#fdba74', light: '#fff7ed', border: '#ea580c' },
];

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENCE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads notes from localStorage.
 * Returns the saved array, or a default welcome note if nothing is saved yet.
 * Wrapped in try/catch because localStorage can throw in private browsing
 * or when storage quota is exceeded.
 */
function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Note[];
      // Validate it's actually an array before trusting it
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Storage unavailable or JSON was corrupt — fall through to default
  }

  // First-time default note
  return [
    {
      id: '1',
      content: 'Welcome! Click here to start writing.',
      timestamp: new Date().toISOString(),
      color: 'amber',
    },
  ];
}

/**
 * Saves the current notes array to localStorage.
 * Called after every state change (add, delete, color change, content change).
 * Also wrapped in try/catch for the same reasons as loadNotes.
 */
function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Silently fail — the UI still works, notes just won't persist
    console.warn('NotesWidget: could not save to localStorage');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PICKER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Renders a row of colored circle buttons for changing a note's color.
 *
 * memo() wraps this so it only re-renders when `current` or `onChange` changes.
 * Without memo, every keystroke in the editor would re-render this too.
 */
const ColorPicker = memo(function ColorPicker({
  current,
  onChange,
}: {
  current: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {NOTE_COLORS.map(c => (
        <button
          key={c.cls}
          onClick={() => onChange(c.cls)}
          style={{
            background: c.hex,
            // Active color gets a stronger border in its own accent color
            border: `2px solid ${current === c.cls ? c.border : 'rgba(0,0,0,0.15)'}`,
            width: 18,
            height: 18,
            borderRadius: '50%',
            // Scale up the active dot so it's clearly selected
            transform: current === c.cls ? 'scale(1.3)' : 'scale(1)',
            transition: 'transform 0.15s, border-color 0.15s',
            flexShrink: 0,
            cursor: 'pointer',
            outline: 'none',
          }}
        />
      ))}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// FORMAT TOOLBAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Renders Bold / Italic / Underline / Strikethrough / Bullet buttons.
 *
 * KEY DESIGN DECISION — onMouseDown + e.preventDefault() instead of onClick:
 *   When you click a button normally (onClick), the browser fires mousedown first,
 *   which moves keyboard focus from the contentEditable div to the button.
 *   By the time onClick fires, the text selection is gone — execCommand has nothing to format.
 *
 *   Using onMouseDown + e.preventDefault() tells the browser:
 *   "don't move focus on this mousedown." The contentEditable keeps its selection,
 *   and we can immediately call execCommand on the still-selected text.
 *
 * activeFormats is a Set<FormatType> — the toolbar reads this to show
 * which buttons should appear "pressed" (darker bg, shadow-inner).
 */
const FormatToolbar = memo(function FormatToolbar({
  onFormat,
  onBullet,
  activeFormats,
  bulletActive,
}: {
  onFormat: (f: FormatType) => void;
  onBullet: () => void;
  activeFormats: Set<FormatType>;
  bulletActive: boolean;
}) {
  // Shared base class for all toolbar buttons
  const base = 'flex items-center justify-center w-7 h-7 rounded transition-all duration-100 cursor-pointer border-none outline-none';
  // Active = visually "pressed"
  const on   = 'bg-black/20 text-gray-900 shadow-inner';
  // Inactive = subtle hover
  const off  = 'hover:bg-black/10 text-gray-600 bg-transparent';

  // Tuple: [execCommand name, icon element, tooltip label]
  const fmts: [FormatType, React.ReactNode, string][] = [
    ['bold',          <Bold size={13} />,          'Bold (Ctrl+B)'],
    ['italic',        <Italic size={13} />,        'Italic (Ctrl+I)'],
    ['underline',     <Underline size={13} />,     'Underline (Ctrl+U)'],
    ['strikeThrough', <Strikethrough size={13} />, 'Strikethrough'],
  ];

  return (
    <div className="flex items-center gap-0.5">
      {fmts.map(([type, icon, label]) => (
        <button
          key={type}
          title={label}
          onMouseDown={(e) => { e.preventDefault(); onFormat(type); }}
          className={`${base} ${activeFormats.has(type) ? on : off}`}
        >
          {icon}
        </button>
      ))}

      {/* Bullet button — uses insertUnorderedList execCommand */}
      <button
        title="Bullet list"
        onMouseDown={(e) => { e.preventDefault(); onBullet(); }}
        className={`${base} ${bulletActive ? on : off}`}
      >
        <List size={13} />
      </button>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// NOTE CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Renders a single sticky note with:
 *   - A colored toolbar (color picker + format buttons + add/delete)
 *   - A contentEditable div as the rich text editor
 *   - A timestamp footer
 *
 * WHY contentEditable instead of <textarea>:
 *   A <textarea> only renders plain text — it literally cannot display bold,
 *   italic, underline, or strikethrough. Markdown symbols like ** just show as **.
 *   contentEditable lets the browser render actual HTML inside it, so
 *   <strong>hello</strong> displays as bold "hello".
 *
 * WHY memo():
 *   Without memo, any state change in the parent (NotesWidget) would re-render
 *   ALL note cards. With memo, a card only re-renders when its own props change.
 *   Since content changes are debounced (not passed up on every keystroke),
 *   typing in one note doesn't touch the others at all.
 */
const NoteCard = memo(function NoteCard({
  note,
  isFirst,
  notesCount,
  onDelete,
  onColorChange,
  onContentChange,
  onAddNote,
}: {
  note: Note;
  isFirst: boolean;
  notesCount: number;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onContentChange: (id: string, content: string) => void;
  onAddNote: () => void;
}) {
  // Direct ref to the contentEditable DOM node
  const editorRef = useRef<HTMLDivElement>(null);

  // Stores the debounce timer ID so we can cancel + restart it on each keystroke
  const flushRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Look up full color metadata from the stored color key
  const colorMeta = NOTE_COLORS.find(c => c.cls === note.color) ?? NOTE_COLORS[0];

  // Which format buttons should appear "active" (bold, italic, etc.)
  const [activeFormats, setActiveFormats] = useState<Set<FormatType>>(new Set());

  // Whether the cursor is currently inside a bullet list item
  const [bulletActive, setBulletActive] = useState(false);

  // ── Mount: set initial HTML content ──────────────────────────────────────
  // contentEditable is UNCONTROLLED — we don't use a `value` prop like a textarea.
  // React doesn't manage its content after mount. We set innerHTML once here,
  // then read it back only when flushing to parent state.
  // The empty dep array [] means this runs once, on first render only.
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = note.content;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Debounced flush to parent ─────────────────────────────────────────────
  // Every time the user types, we don't immediately push to parent state.
  // Instead we wait 500ms of inactivity. This means the parent's notes array
  // (and all sibling NoteCards) are NOT re-rendered on every single keystroke.
  const flush = useCallback(() => {
    if (flushRef.current) clearTimeout(flushRef.current);
    flushRef.current = setTimeout(() => {
      const html = editorRef.current?.innerHTML ?? '';
      onContentChange(note.id, html);
    }, 500);
  }, [note.id, onContentChange]);

  // ── Active format detection ───────────────────────────────────────────────
  // document.queryCommandState('bold') returns true if the cursor / selection
  // is currently inside a <strong> element. Same for italic, underline, strikeThrough.
  // We call this on keyup, mouseup, and input so the toolbar always reflects reality.
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<FormatType>();
    (['bold', 'italic', 'underline', 'strikeThrough'] as FormatType[]).forEach(f => {
      if (document.queryCommandState(f)) formats.add(f);
    });
    setActiveFormats(formats);

    // Check if cursor's anchor node is inside an <li> for bullet detection
    const sel = window.getSelection();
    if (sel?.anchorNode) {
      const node = sel.anchorNode as Element;
      const li = node.closest?.('li') ?? node.parentElement?.closest('li');
      setBulletActive(!!li);
    }
  }, []);

  // ── Format handler ────────────────────────────────────────────────────────
  // document.execCommand('bold') wraps selected text in <strong>.
  // It also TOGGLES — if the text is already bold, it removes <strong>.
  // This is why we use execCommand instead of manually inserting HTML tags.
  const handleFormat = useCallback((type: FormatType) => {
    editorRef.current?.focus();
    document.execCommand(type, false);
    updateActiveFormats();
    flush();
  }, [updateActiveFormats, flush]);

  // ── Bullet handler ────────────────────────────────────────────────────────
  // insertUnorderedList creates a real <ul><li> structure.
  // Press Enter inside a list item → browser creates new <li> (native behavior).
  // Press Enter on an empty list item → browser exits the list (native behavior).
  const handleBullet = useCallback(() => {
    editorRef.current?.focus();
    document.execCommand('insertUnorderedList', false);
    updateActiveFormats();
    flush();
  }, [updateActiveFormats, flush]);

  // Called on every keystroke — triggers debounced flush + toolbar update
  const handleInput   = useCallback(() => { flush(); updateActiveFormats(); }, [flush, updateActiveFormats]);
  const handleKeyUp   = useCallback(() => updateActiveFormats(), [updateActiveFormats]);
  const handleMouseUp = useCallback(() => updateActiveFormats(), [updateActiveFormats]);

  // ── Select all on focus ───────────────────────────────────────────────────
  // When the user clicks into the note, select all existing text so they can
  // immediately start typing to replace it (like a real sticky note).
  // Uses the Selection API instead of e.target.select() because contentEditable
  // is a div, not an input — divs don't have a .select() method.
  const handleFocus = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, []);

  // Stable callbacks passed to child ColorPicker — memo on ColorPicker only
  // helps if these references don't change every render. useCallback ensures that.
  const handleColorChange = useCallback(
    (color: string) => onColorChange(note.id, color),
    [note.id, onColorChange]
  );
  const handleDelete = useCallback(
    () => onDelete(note.id),
    [note.id, onDelete]
  );

  return (
    <div
      style={{
        background: colorMeta.light,
        borderColor: `${colorMeta.border}44`, // 44 = ~27% opacity in hex
        borderWidth: 1,
        borderStyle: 'solid',
      }}
      className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-150"
    >
      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div
        style={{
          background: `${colorMeta.hex}99`, // 99 = 60% opacity in hex
          borderBottom: `1px solid ${colorMeta.border}33`,
        }}
        className="flex items-center gap-2 px-2.5 py-2 flex-wrap rounded-t-xl"
      >
        <ColorPicker current={note.color} onChange={handleColorChange} />

        {/* Visual divider between color picker and format buttons */}
        <div className="w-px h-4 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.15)' }} />

        <FormatToolbar
          onFormat={handleFormat}
          onBullet={handleBullet}
          activeFormats={activeFormats}
          bulletActive={bulletActive}
        />

        {/* Add + Delete buttons pushed to the right */}
        <div className="flex items-center gap-0.5 ml-auto">
          {/* Only show + on the first note, and only if under the 2-note limit */}
          {isFirst && notesCount < 2 && (
            <button
              onClick={onAddNote}
              title="New note"
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-black/10 text-gray-600 transition-colors"
            >
              <Plus size={14} />
            </button>
          )}

          <button
            onClick={handleDelete}
            title="Delete"
            className="flex items-center justify-center w-7 h-7 rounded text-red-400 hover:text-red-600 transition-colors"
            style={{ background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = `${colorMeta.border}22`)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* ── Rich Text Editor ──────────────────────────────────────────────── */}
      {/*
        contentEditable turns this div into a browser-native rich text editor.
        The browser handles all editing, cursor movement, selection, undo/redo.
        We just read its innerHTML when we need to save.

        suppressContentEditableWarning silences React's warning about
        managing children inside a contentEditable element.
      */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        data-placeholder="Click to write…"
        className="w-full min-h-[90px] px-3 py-2 text-sm leading-relaxed focus:outline-none"
        style={{
          color: 'rgba(0,0,0,0.75)',
          caretColor: colorMeta.border, // Cursor blinks in the note's accent color
          wordBreak: 'break-word',
        }}
      />

      {/* Timestamp — shows when the note was created */}
      <p className="text-[10px] px-3 pb-2" style={{ color: 'rgba(0,0,0,0.38)' }}>
        {new Date(note.timestamp).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>

      {/* Scoped styles for contentEditable behavior */}
      <style>{`
        /* Show placeholder text when the editor is empty */
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(0,0,0,0.38);
          pointer-events: none;
        }
        /* Style the bullet list rendered by insertUnorderedList */
        [contenteditable] ul { list-style: disc; padding-left: 1.2rem; }
        [contenteditable] li { margin: 2px 0; }
      `}</style>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// WIDGET ROOT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The top-level NotesWidget component.
 *
 * STATE MANAGEMENT + PERSISTENCE:
 *   Notes are stored in React state (for the UI) AND in localStorage (for persistence).
 *   Every state mutation (add, delete, color change, content change) calls saveNotes()
 *   immediately after updating state, so localStorage stays in sync.
 *
 *   On first render, useState is initialized with loadNotes(), which reads from
 *   localStorage. If localStorage has saved notes, they're restored automatically.
 *   If not (first visit or cleared storage), a default welcome note is shown.
 *
 * WHY NOT useEffect FOR SAVING?
 *   We could watch state with useEffect and save on every change, but that adds
 *   a render cycle between the change and the save. Calling saveNotes() directly
 *   inside each handler is simpler and more predictable.
 */
export function NotesWidget() {
  // useState with a function argument = "lazy initializer"
  // loadNotes() runs ONCE on mount, not on every render
  const [notes, setNotes] = useState<Note[]>(loadNotes);

  // ── Add note ─────────────────────────────────────────────────────────────
  const addNote = useCallback(() => {
    setNotes(prev => {
      // Hard cap at 2 notes to keep the widget compact on the home screen
      if (prev.length >= 2) return prev;
      const next: Note[] = [{
        id: Date.now().toString(),
        content: '',
        timestamp: new Date().toISOString(),
        color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)].cls,
      }, ...prev];
      saveNotes(next); // Persist to localStorage immediately
      return next;
    });
  }, []);

  // ── Delete note ───────────────────────────────────────────────────────────
  const deleteNote = useCallback((id: string) => {
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id);
      saveNotes(next); // Persist to localStorage immediately
      return next;
    });
  }, []);

  // ── Change note color ─────────────────────────────────────────────────────
  const changeColor = useCallback((id: string, color: string) => {
    setNotes(prev => {
      const next = prev.map(n => n.id === id ? { ...n, color } : n);
      saveNotes(next); // Persist to localStorage immediately
      return next;
    });
  }, []);

  // ── Update note content ───────────────────────────────────────────────────
  // Called 500ms after the user stops typing (debounced inside NoteCard).
  // At this point we save the latest HTML content to localStorage.
  const changeContent = useCallback((id: string, content: string) => {
    setNotes(prev => {
      const next = prev.map(n => n.id === id ? { ...n, content } : n);
      saveNotes(next); // Persist to localStorage immediately
      return next;
    });
  }, []);

  return (
    <div
      className="fixed right-4 top-20 w-72 space-y-3 overflow-y-auto pb-4"
      style={{ maxHeight: 'calc(100vh - 90px)' }}
    >
      {notes.map((note, i) => (
        <NoteCard
          key={note.id}
          note={note}
          isFirst={i === 0}
          notesCount={notes.length}
          onAddNote={addNote}
          onDelete={deleteNote}
          onColorChange={changeColor}
          onContentChange={changeContent}
        />
      ))}
    </div>
  );
}