import { X } from 'lucide-react';
import { FaSpotify } from "react-icons/fa";
import type { Song } from '../system/types';

interface SpotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSongSelect: (song: Song) => void;
  playlist: Song[];
  formatTime: (seconds: number) => string;
}

export function SpotifyModal({ isOpen, onClose, onSongSelect, playlist, formatTime }: SpotifyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:w-[450px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] sm:max-h-[600px] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-b from-green-600 to-green-700 px-6 py-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaSpotify size={32} className="text-white" />
              <h2 className="text-2xl font-bold text-white">Choose a song</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search songs, artists..."
              className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-180px)] sm:max-h-[420px] px-4 py-4">
          {playlist.map((song) => (
            <button
              key={song.id}
              onClick={() => onSongSelect(song)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors mb-2 text-left"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {song.albumArt}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{song.title}</div>
                <div className="text-white/60 text-sm truncate">{song.artist}</div>
              </div>
              <div className="text-white/40 text-sm">{formatTime(song.duration)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
