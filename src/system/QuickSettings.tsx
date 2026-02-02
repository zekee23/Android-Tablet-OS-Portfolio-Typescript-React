import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Wifi, Volume2, Settings, Plane, RotateCw, Building2, Music, Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';
import { useQuickSettings } from '../hooks/useQuickSettings';
import { BatteryIcon } from '../components/Battery';
import { useBattery } from '../hooks/useBattery';
import { FaGithub, FaLinkedin, FaSpotify } from "react-icons/fa";

export function QuickSettings() {
  const { isOpen, close } = useQuickSettings();
  const { percentage: batteryPercentage, isCharging } = useBattery();
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(70);
  const [panelHeight, setPanelHeight] = useState(600);
  const startY = useRef(0);
  const initialDragOffset = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const brightnessTimeoutRef = useRef<number | null>(null);
  const volumeTimeoutRef = useRef<number | null>(null);
  
  // Audio reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Spotify state
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    title: "Select a song",
    artist: "Spotify",
    duration: 0,
    currentTime: 0,
    audioUrl: ""
  });
  
  const [toggles, setToggles] = useState({
    wifi: true,
    linkedin: false,
    airplane: true,
    flashlight: false,
    autoRotate: false,
    spotify: false,
    github: false,
    location: true
  });

  // Sample playlist with real audio URLs (you'll need to replace these with your own)
  // You can use royalty-free music or host your own MP3 files
  const playlist = [
    { 
      id: 1, 
      title: "Blinding Lights", 
      artist: "The Weeknd", 
      duration: 200, 
      albumArt: "🎵",
      audioUrl: "https://www.youtube.com/watch?v=NWU33fvPxd0&list=RDsjN-NGsRg9g&index=6" // Replace with actual URL
    },
    { 
      id: 2, 
      title: "Shape of You", 
      artist: "Ed Sheeran", 
      duration: 233, 
      albumArt: "🎵",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" // Replace with actual URL
    },
    { 
      id: 3, 
      title: "Levitating", 
      artist: "Dua Lipa", 
      duration: 203, 
      albumArt: "🎵",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" // Replace with actual URL
    },
    { 
      id: 4, 
      title: "Peaches", 
      artist: "Justin Bieber", 
      duration: 198, 
      albumArt: "🎵",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" // Replace with actual URL
    },
    { 
      id: 5, 
      title: "Stay", 
      artist: "The Kid LAROI, Justin Bieber", 
      duration: 141, 
      albumArt: "🎵",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" // Replace with actual URL
    },
    { 
      id: 6, 
      title: "Good 4 U", 
      artist: "Olivia Rodrigo", 
      duration: 178, 
      albumArt: "🎵",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" // Replace with actual URL
    },
    { 
      id: 7, 
      title: "Montero", 
      artist: "Lil Nas X", 
      duration: 137, 
      albumArt: "🎵",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" // Replace with actual URL
    },
    { 
      id: 8, 
      title: "Save Your Tears", 
      artist: "The Weeknd", 
      duration: 215, 
      albumArt: "🎵",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" // Replace with actual URL
    },
  ];

  type ToggleKey = keyof typeof toggles;

  const handleToggle = (key: ToggleKey) => {
    if (key === 'spotify') {
      setShowSpotifyModal(true);
    } else {
      setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;
    
    // Update current time as song plays
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentSong(prev => ({
          ...prev,
          currentTime: Math.floor(audioRef.current!.currentTime)
        }));
      }
    };

    // Handle when song ends
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentSong(prev => ({
        ...prev,
        currentTime: 0
      }));
    };

    // Update duration when metadata loads
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setCurrentSong(prev => ({
          ...prev,
          duration: Math.floor(audioRef.current!.duration)
        }));
      }
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.pause();
      }
    };
  }, []);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleSongSelect = (song: typeof playlist[0]) => {
    if (audioRef.current) {
      // Stop current song
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Load new song
      audioRef.current.src = song.audioUrl;
      audioRef.current.load();
      
      setCurrentSong({
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        currentTime: 0,
        audioUrl: song.audioUrl
      });
      
      // Play the song
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setToggles(prev => ({ ...prev, spotify: true }));
      }).catch(error => {
        console.error("Error playing audio:", error);
      });
      
      setShowSpotifyModal(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Error playing audio:", error);
        });
      }
    }
  };

  const handleSkipForward = () => {
    const currentIndex = playlist.findIndex(song => song.audioUrl === currentSong.audioUrl);
    if (currentIndex < playlist.length - 1) {
      handleSongSelect(playlist[currentIndex + 1]);
    } else {
      // Loop back to first song
      handleSongSelect(playlist[0]);
    }
  };

  const handleSkipBack = () => {
    const currentIndex = playlist.findIndex(song => song.audioUrl === currentSong.audioUrl);
    if (currentIndex > 0) {
      handleSongSelect(playlist[currentIndex - 1]);
    } else {
      // Go to last song
      handleSongSelect(playlist[playlist.length - 1]);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && currentSong.duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * currentSong.duration;
      audioRef.current.currentTime = newTime;
      setCurrentSong(prev => ({
        ...prev,
        currentTime: Math.floor(newTime)
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Debounced brightness handler for better performance
  const handleBrightnessChange = useCallback((value: number) => {
    if (brightnessTimeoutRef.current) {
      cancelAnimationFrame(brightnessTimeoutRef.current);
    }
    brightnessTimeoutRef.current = requestAnimationFrame(() => {
      setBrightness(value);
    });
  }, []);

  // Debounced volume handler for better performance
  const handleVolumeChange = useCallback((value: number) => {
    if (volumeTimeoutRef.current) {
      cancelAnimationFrame(volumeTimeoutRef.current);
    }
    volumeTimeoutRef.current = requestAnimationFrame(() => {
      setVolume(value);
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input[type="range"]')) {
      return;
    }
    e.preventDefault();
    startY.current = e.clientY;
    initialDragOffset.current = dragOffset;
    setIsDragging(true);
  }, [dragOffset]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const currentY = e.clientY;
    const deltaY = currentY - startY.current;
    let newOffset = initialDragOffset.current + deltaY;
    newOffset = Math.max(0, Math.min(panelHeight, newOffset));
    setDragOffset(newOffset);
  }, [isDragging, panelHeight]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = panelHeight / 2;
    if (dragOffset > threshold) {
      setDragOffset(panelHeight);
    } else {
      setDragOffset(0);
    }
  }, [isDragging, dragOffset, panelHeight]);

  // Touch event handlers
  useEffect(() => {
    const panel = panelRef.current;
    const statusBar = statusBarRef.current;
    
    if (!panel || !statusBar) return;

    const handleTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('button, input[type="range"]')) {
        return;
      }
      e.preventDefault();
      const touch = e.touches[0];
      startY.current = touch.clientY;
      initialDragOffset.current = dragOffset;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const deltaY = currentY - startY.current;
      let newOffset = initialDragOffset.current + deltaY;
      newOffset = Math.max(0, Math.min(panelHeight, newOffset));
      setDragOffset(newOffset);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setIsDragging(false);
      const threshold = panelHeight / 2;
      if (dragOffset > threshold) {
        setDragOffset(panelHeight);
      } else {
        setDragOffset(0);
      }
    };

    panel.addEventListener('touchstart', handleTouchStart, { passive: false });
    panel.addEventListener('touchmove', handleTouchMove, { passive: false });
    panel.addEventListener('touchend', handleTouchEnd, { passive: false });
    statusBar.addEventListener('touchstart', handleTouchStart, { passive: false });
    statusBar.addEventListener('touchmove', handleTouchMove, { passive: false });
    statusBar.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart);
      panel.removeEventListener('touchmove', handleTouchMove);
      panel.removeEventListener('touchend', handleTouchEnd);
      statusBar.removeEventListener('touchstart', handleTouchStart);
      statusBar.removeEventListener('touchmove', handleTouchMove);
      statusBar.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragOffset, isDragging, panelHeight]);

  useEffect(() => {
    if (isDragging) {
      const handleMove = (e: MouseEvent) => handleMouseMove(e);
      const handleUp = () => handleMouseUp();
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      return () => {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const updatePanelHeight = () => {
      const screenHeight = window.innerHeight;
      const isMobile = window.innerWidth < 640;
      let maxHeight: number;
      
      if (isMobile) {
        if (screenHeight >= 730) {
          maxHeight = Math.min(screenHeight * 0.92, 800);
        } else {
          maxHeight = Math.min(screenHeight * 0.85, 700);
        }
      } else {
        maxHeight = Math.min(600, screenHeight * 0.8);
      }
      setPanelHeight(maxHeight);
    };

    updatePanelHeight();
    window.addEventListener('resize', updatePanelHeight);
    return () => window.removeEventListener('resize', updatePanelHeight);
  }, []);

  useEffect(() => {
    if (dragOffset === 0 && isOpen) {
      close();
    }
  }, [dragOffset, isOpen, close]);

  useEffect(() => {
    const brightnessValue = brightness / 100;
    document.documentElement.style.filter = `brightness(${brightnessValue})`;
    return () => {
      document.documentElement.style.filter = '';
    };
  }, [brightness]);

  const QuickSettingTile = ({ 
    icon: Icon, 
    label, 
    active, 
    onClick 
  }: {
    icon: any;
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all touch-manipulation ${
        active ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/90 hover:bg-white/20 active:bg-white/30'
      }`}
    >
      <Icon size={20} strokeWidth={2} className="sm:w-6 sm:h-6" />
      <span className="text-xs mt-1 sm:mt-2 font-medium">{label}</span>
    </button>
  );

  const currentTime = new Date().toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      {/* Status Bar */}
      <div 
        ref={statusBarRef}
        className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between text-white cursor-pointer bg-black/20 backdrop-blur-sm select-none touch-none"
        onMouseDown={handleMouseDown}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none'
        }}
      >
        <div className="text-sm font-medium">{currentTime}</div>
        <div className="flex items-center gap-2">
          {toggles.wifi && <Wifi size={16} />}
          <BatteryIcon percentage={batteryPercentage} size={16} showPercentage={false} />
        </div>
      </div>

      {/* Quick Settings Panel */}
      <div 
        ref={panelRef}
        className="fixed left-0 right-0 z-20 bg-gradient-to-b from-slate-900/98 to-slate-800/98 backdrop-blur-xl shadow-2xl select-none touch-none"
        style={{
          top: `-${panelHeight - 10}px`,
          height: `${panelHeight}px`,
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: dragOffset > 0 ? 1 : 0,
          pointerEvents: dragOffset > 0 ? 'auto' : 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none',
          overscrollBehavior: 'none'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-6 max-h-full overflow-y-auto overscroll-none scrollbar-hide">
          {/* Drag Handle */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
          </div>
          
          {/* Date and Settings */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="text-white">
              <div className="text-xs sm:text-3xl font-light">{currentTime}</div>
              <div className="text-xs sm:text-sm text-white/60 mt-1">{currentDate}</div>
              <div className="text-xs text-white/40 mt-0.5">Manila, Philippines</div>
            </div>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors touch-manipulation">
              <Settings size={20} />
            </button>
          </div>

          {/* Quick Settings Tiles */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <QuickSettingTile 
              icon={Wifi} 
              label="Wi-Fi" 
              active={toggles.wifi} 
              onClick={() => handleToggle('wifi')} 
            />
            <QuickSettingTile 
              icon={FaLinkedin}
              label="Click to Connect" 
              active={toggles.linkedin} 
              onClick={() => {
                handleToggle('linkedin');
                window.open(import.meta.env.VITE_LINKEDIN_URL, '_blank');
              }} 
            />
            {!toggles.airplane && (
              <QuickSettingTile 
                icon={Building2}
                label="Open to Work Onsite"
                active={false}
                onClick={() => handleToggle('airplane')}
              />
            )}
            {toggles.airplane && (
              <QuickSettingTile 
                icon={Plane} 
                label="Open to Remote Work" 
                active={toggles.airplane} 
                onClick={() => handleToggle('airplane')} 
              />
            )}
            
            <QuickSettingTile 
              icon={FaGithub}
              label="Visit My GitHub | @zekee23" 
              active={toggles.github} 
              onClick={() => { 
                handleToggle('github');
                window.open(import.meta.env.VITE_GITHUB_URL, '_blank');
              }}
            />
            <QuickSettingTile 
              icon={RotateCw} 
              label="Auto-rotate" 
              active={toggles.autoRotate} 
              onClick={() => handleToggle('autoRotate')} 
            />
            <QuickSettingTile 
              icon={FaSpotify} 
              label="Music" 
              active={toggles.spotify} 
              onClick={() => handleToggle('spotify')} 
            />
          </div>

          {/* Now Playing Widget */}
          {toggles.spotify && currentSong.title !== "Select a song" && (
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
                  onClick={() => setShowSpotifyModal(true)}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Music size={20} />
                </button>
              </div>
              
              {/* Progress Bar - Now clickable */}
              <div className="mb-2">
                <div 
                  className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                  onClick={handleProgressClick}
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
              
              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={handleSkipBack}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <SkipBack size={20} />
                </button>
                <button 
                  onClick={togglePlayPause}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause size={20} className="text-green-600" fill="currentColor" />
                  ) : (
                    <Play size={20} className="text-green-600 ml-0.5" fill="currentColor" />
                  )}
                </button>
                <button 
                  onClick={handleSkipForward}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <SkipForward size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Brightness Slider */}
          <div className="mb-3 bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 touch-manipulation">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-xs sm:text-sm font-medium">Brightness</span>
              <span className="text-white/60 text-xs">{brightness}%</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="100" 
              value={brightness} 
              onChange={(e) => handleBrightnessChange(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((brightness - 20) / 80) * 100}%, rgba(255,255,255,0.2) ${((brightness - 20) / 80) * 100}%, rgba(255,255,255,0.2) 100%)`,
                touchAction: 'auto'
              }}
            />
          </div>

          {/* Volume Slider */}
          <div className="mb-3 bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 touch-manipulation">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-xs sm:text-sm font-medium flex items-center gap-2">
                <Volume2 size={16} />
                Volume
              </span>
              <span className="text-white/60 text-xs">{volume}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`,
                touchAction: 'auto'
              }}
            />
          </div>

          {/* Battery Info */}
          <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <BatteryIcon percentage={batteryPercentage} size={16} showPercentage={false} />
                <span className="text-white/80 text-xs sm:text-sm font-medium">Battery</span>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-xs">
                  {batteryPercentage}% remaining
                </div>
                <div className="text-white/40 text-xs">
                  {isCharging ? 'Full charge in 45 min' : `${Math.floor(batteryPercentage * 0.6)}h remaining`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Drag Handle - Mobile Only */}
        <div className="flex justify-center mt-8 mb-4 min-h-[800px]:mt-46 sm:hidden">
          <div className="w-12 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Spotify Modal */}
      {showSpotifyModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSpotifyModal(false)}
          />
          <div className="relative w-full sm:w-[450px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] sm:max-h-[600px] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-b from-green-600 to-green-700 px-6 py-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FaSpotify size={32} className="text-white" />
                  <h2 className="text-2xl font-bold text-white">Choose a song</h2>
                </div>
                <button 
                  onClick={() => setShowSpotifyModal(false)}
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

            {/* Playlist */}
            <div className="overflow-y-auto max-h-[calc(85vh-180px)] sm:max-h-[420px] px-4 py-4">
              {playlist.map((song) => (
                <button
                  key={song.id}
                  onClick={() => handleSongSelect(song)}
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
      )}

      {/* Overlay when quick settings is open */}
      {dragOffset > 0 && (
        <div 
          className="fixed inset-0 bg-black/40 z-10 touch-manipulation" 
          onClick={() => setDragOffset(0)} 
        />
      )}

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          transform: translateY(-5px);
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: translateY(-2px) scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          transform: translateY(-2px);
        }
        input[type="range"]::-moz-range-thumb:hover {
          transform: translateY(-2px) scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 2px;
        }
        input[type="range"]::-moz-range-track {
          height: 4px;
          border-radius: 2px;
        }
        
        body {
          overscroll-behavior: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}