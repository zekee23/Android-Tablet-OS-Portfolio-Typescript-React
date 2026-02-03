import { Music, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import type { CurrentSong } from '../system/types';

interface MediaPlayerProps {
  currentSong: CurrentSong;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipForward: () => void;
  onSkipBack: () => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onOpenModal: () => void;
  formatTime: (seconds: number) => string;
}

export function MediaPlayer({ 
  currentSong, 
  isPlaying, 
  onTogglePlay, 
  onSkipForward, 
  onSkipBack, 
  onProgressClick,
  onOpenModal,
  formatTime 
}: MediaPlayerProps) {
  if (currentSong.title === "Select a song") {
    return null;
  }

  return (
    <div className="mb-3 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl sm:rounded-2xl p-4 border border-green-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center text-2xl">
            {isPlaying ? '🎶' : '🎵'}
          </div>
          <div>
            <div className="text-white font-medium text-sm">{currentSong.title}</div>
            <div className="text-white/60 text-xs">{currentSong.artist}</div>
          </div>
        </div>
        <button 
          onClick={onOpenModal}
          className="text-green-400 hover:text-green-300 transition-colors"
        >
          <Music size={20} />
        </button>
      </div>
      
      <div className="mb-2">
        <div 
          className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer"
          onClick={onProgressClick}
        >
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${(currentSong.currentTime / currentSong.duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/60 mt-1">
          <span>{formatTime(currentSong.currentTime)}</span>
          <span>{formatTime(currentSong.duration)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={onSkipBack}
          className="text-white/80 hover:text-white transition-colors"
        >
          <SkipBack size={20} />
        </button>
        <button 
          onClick={onTogglePlay}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <Pause size={20} className="text-green-600" fill="currentColor" />
          ) : (
            <Play size={20} className="text-green-600 ml-0.5" fill="currentColor" />
          )}
        </button>
        <button 
          onClick={onSkipForward}
          className="text-white/80 hover:text-white transition-colors"
        >
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
}
