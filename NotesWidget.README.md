# NotesWidget — Developer README

A sticky notepad widget built in React + TypeScript for a desktop-style home screen. This document explains every decision made during development, why bugs occurred, and how they were fixed.

---

## The Journey: What Was Wrong & How It Got Fixed

### Problem 1 — Text was not editable (the `<input>` bug)

**Original code used:**
```tsx
<input type="text" value={note.content} onChange={...} />
```

**Why it failed:**  
A single-line `<input>` doesn't support multiline text. More critically, the parent note card had an `onClick` handler that stole focus every time the user clicked. The parent `div` also had `overflow-hidden` which visually and functionally clipped the input, making it seem unclickable.

**Fix:**  
- Replaced `<input>` with `<textarea>`  
- Removed `overflow-hidden` from the card
- Added `e.stopPropagation()` on the textarea's click/change handlers so the parent div's onClick doesn't interfere

---

### Problem 2 — `select-none` on the HomeScreen blocked everything

**The HomeScreen root div had:**
```tsx
<div className="... select-none">
```

`select-none` sets `user-select: none` in CSS, which cascades down to **all children**, including the NotesWidget. This blocked text selection, clicking, and typing inside the notepad.

**Fix in `HomeScreen.tsx`:**
```tsx
<div className="hidden md:block select-text pointer-events-auto relative z-20">
  <NotesWidget />
</div>
```

Three classes were needed:
- `select-text` — re-enables text selection for the widget subtree
- `pointer-events-auto` — re-enables mouse clicks (some browsers suppress these under select-none)
- `relative z-20` — explained below

---

### Problem 3 — The HomeScreen content div sat on top of the widget (z-index)

**The layout stack looked like this:**
```
[z-10] Home Screen Content div  ← full min-h-screen covering the whole page
[z-0]  NotesWidget              ← no z-index, buried underneath, all clicks eaten
```

The main content wrapper had `relative z-10 min-h-screen`, making it a full-viewport-sized invisible layer that intercepted every click before it reached the notes.

**Fix:**  
Add `relative z-20` to the NotesWidget wrapper so it sits **above** the content layer.

---

### Problem 4 — Bold/Italic/Underline/Strikethrough only inserted symbols (`**`, `_`, `~~`)

**This was the biggest architectural mistake.** The original approach tried to wrap selected text in markdown-style syntax:
```ts
// Inserted literal characters into the textarea value
wrapSelection(ta, '**', '**', getValue, setValue);
// Result: user sees **hello** instead of bold text
```

**Why it fundamentally cannot work in a `<textarea>`:**  
A `textarea` is a plain text input. It has no concept of rich formatting. It cannot render `**hello**` as **bold** — it just shows the asterisks as characters. There is no way to make a textarea display styled text.

**The real fix — switch to `contentEditable`:**  
A `contentEditable` div is what browsers use internally for rich text editors (like Google Docs, Notion, etc.). It can render actual HTML — `<strong>`, `<em>`, `<u>`, `<s>` — as visually formatted text.

Combined with `document.execCommand()`, the browser handles all the formatting natively:

```ts
// This actually makes selected text BOLD in the DOM
document.execCommand('bold', false);

// This actually makes selected text ITALIC
document.execCommand('italic', false);

// This actually underlines selected text
document.execCommand('underline', false);

// This actually strikes through selected text
document.execCommand('strikeThrough', false);

// This creates a real <ul><li> bullet list
document.execCommand('insertUnorderedList', false);
```

The browser wraps the selected text in the correct HTML tag, renders it styled, and handles toggling (run it again to unwrap).

---

### Problem 5 — Format buttons lost the text selection on click

**Why this happened:**  
When you click a button with `onClick`, the browser first fires `mousedown`, which moves focus away from the `contentEditable` div to the button. By the time `click` fires, the text selection is gone — so `execCommand` has nothing to format.

**Fix — use `onMouseDown` + `e.preventDefault()`:**
```tsx
<button onMouseDown={(e) => { e.preventDefault(); onFormat(type); }}>
```

`e.preventDefault()` on `mousedown` tells the browser: "do not move focus." The `contentEditable` div keeps its selection, and `execCommand` can apply the format to the correct text.

---

### Problem 6 — Active format state (toolbar buttons not lighting up)

**Why it failed before:**  
The previous approach tried to parse raw text (`**`, `_`, etc.) to detect formatting. That only works for markdown, not HTML.

**The correct approach — `document.queryCommandState()`:**
```ts
document.queryCommandState('bold')      // returns true if cursor is inside <strong>
document.queryCommandState('italic')    // returns true if cursor is inside <em>
document.queryCommandState('underline') // returns true if cursor is inside <u>
```

This is called on every `keyup`, `mouseup`, and `input` event so the toolbar always reflects the format at the current cursor position. The toolbar button visually activates (darker background, shadow-inner) when its format is active.

---

## Architecture Overview

```
NotesWidget                    ← manages the list of notes in state
  └── NoteCard (memo)          ← one note; manages its own editor state
        ├── ColorPicker (memo) ← 6 color dot buttons, only re-renders if color changes
        ├── FormatToolbar (memo) ← bold/italic/underline/strike/bullet buttons
        └── contentEditable div ← the actual rich text editor
```

### Why `memo()` on every component?

`React.memo` makes a component skip re-rendering if its props haven't changed. Without it:
- Typing in one note would re-render ALL notes
- Clicking a color would re-render ALL notes and ALL toolbars

With `memo`, only the specific component whose props changed re-renders.

---

## Performance Decisions

### 1. Debounced flush to parent state (500ms)
```ts
const flush = useCallback(() => {
  if (flushRef.current) clearTimeout(flushRef.current);
  flushRef.current = setTimeout(() => {
    onContentChange(note.id, editorRef.current?.innerHTML ?? '');
  }, 500);
}, [note.id, onContentChange]);
```
Every keystroke in the editor does NOT update parent state. It waits 500ms after the user stops typing. This means the parent `notes` array (and all sibling `NoteCard` components) are not touched while the user is typing — zero unnecessary re-renders.

### 2. `contentEditable` is uncontrolled
Unlike a `<textarea value={...}>`, the `contentEditable` div is not controlled by React. Its content lives in the DOM, managed by the browser's native editing engine. React only touches it on mount (to set `innerHTML`) and on flush (to read `innerHTML`). This is intentional — React controlling a `contentEditable` causes cursor jumping and selection loss.

### 3. `useCallback` on all handlers
Every function passed as a prop is wrapped in `useCallback` with correct dependencies. This ensures the function reference stays stable between renders, so `memo()` on child components actually works (if the function reference changes every render, memo is bypassed).

### 4. `useRef` for the flush timer
`flushRef` uses `useRef` instead of `useState` to store the debounce timer. `useRef` changes do not trigger re-renders, which is exactly what we want for a timer ID.

---

## Color System

Each color has three values:
```ts
{ cls: 'amber', hex: '#fcd34d', light: '#fef9c3', border: '#d97706' }
```

| Property | Used for |
|----------|----------|
| `cls`    | The note's stored color identifier |
| `hex`    | Toolbar background (slightly transparent) |
| `light`  | Note card background (soft, easy on eyes) |
| `border` | Border, caret color, delete button hover |

The toolbar takes on the `hex` color at 60% opacity (`${hex}99` in hex = 60% alpha), so each note's toolbar feels color-matched without being overwhelming.

---

## Bullet List Behavior

Bullets use `document.execCommand('insertUnorderedList')` which creates a real HTML `<ul><li>` structure.

- **Activate:** Click the bullet button → current line becomes a list item
- **Continue:** Press `Enter` inside a list item → browser creates a new `<li>` automatically
- **Exit:** Press `Enter` on an empty list item → browser exits the list (native behavior)

The bullet toolbar button detects active state by checking if the cursor's anchor node is inside an `<li>` element:
```ts
const li = sel.anchorNode.closest('li');
setBulletActive(!!li);
```

---

## Key Files

| File | Purpose |
|------|---------|
| `NotesWidget.tsx` | The entire widget — all components live here |
| `HomeScreen.tsx` | Hosts the widget; needed `select-text pointer-events-auto z-20` fixes |

---

## Keyboard Shortcuts (Native, Free)

Because `contentEditable` + `execCommand` uses the browser's native rich text engine, standard keyboard shortcuts work automatically with no extra code:

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+A` | Select all |
ENDOFFILE