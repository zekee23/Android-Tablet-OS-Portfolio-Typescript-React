import { useState, useCallback, useEffect, useRef } from 'react';
import { Wifi, Volume2, Settings, Plane, Building2, RotateCw } from 'lucide-react';
import { useQuickSettings } from '../hooks/useQuickSettings';
import { BatteryIcon } from '../components/Battery';
import { useBattery } from '../hooks/useBattery';
import { FaGithub, FaLinkedin, FaSpotify } from "react-icons/fa";
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useDragPanel } from '../hooks/useDragPanel';
import { QuickSettingTile } from '../components/QuickSettingTile';
import { MediaPlayer } from '../components/MediaPlayer';
import { SpotifyModal } from '../components/SpotifyModal';
import { Slider } from '../components/Slider';
import { DEFAULT_TOGGLES, DEFAULT_BRIGHTNESS, DEFAULT_VOLUME } from './constants';
import { sliderStyles } from '../styles/QuickSettingsStyles';
import type { Toggles, ToggleKey } from './types';

export function QuickSettings() {
  const { isOpen, close } = useQuickSettings();
  const { percentage: batteryPercentage, isCharging } = useBattery();
  
  // Drag panel functionality
  const { dragOffset, setDragOffset, panelHeight, panelRef, statusBarRef, handleMouseDown } = useDragPanel();
  
  // Audio player functionality
  const { 
    isPlaying, 
    currentSong, 
    handleSongSelect, 
    togglePlayPause, 
    handleSkipForward, 
    handleSkipBack, 
    handleProgressClick, 
    setVolume: setAudioVolume, 
    formatTime, 
    playlist 
  } = useAudioPlayer();
  
  // Local state
  const [brightness, setBrightness] = useState(DEFAULT_BRIGHTNESS);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);
  const [toggles, setToggles] = useState<Toggles>(DEFAULT_TOGGLES);
  const [dragHandleMargin, setDragHandleMargin] = useState(16);
  
  // Refs for debounced handlers
  const brightnessTimeoutRef = useRef<number | null>(null);
  const volumeTimeoutRef = useRef<number | null>(null);

  const handleToggle = (key: ToggleKey) => {
    if (key === 'spotify') {
      setShowSpotifyModal(true);
    } else {
      setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSongSelectWithToggle = (song: typeof playlist[0]) => {
    handleSongSelect(song);
    setToggles(prev => ({ ...prev, spotify: true }));
    setShowSpotifyModal(false);
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
      setVolumeState(value);
      setAudioVolume(value);
    });
  }, [setAudioVolume]);

  // Close panel when dragged down completely
  useEffect(() => {
    if (dragOffset === 0 && isOpen) {
      close();
    }
  }, [dragOffset, isOpen, close]);

  // Apply brightness filter
  useEffect(() => {
    const brightnessValue = brightness / 100;
    document.documentElement.style.filter = `brightness(${brightnessValue})`;
    return () => {
      document.documentElement.style.filter = '';
    };
  }, [brightness]);

  // Sync volume with audio player
  useEffect(() => {
    setAudioVolume(volume);
  }, [volume, setAudioVolume]);

  // Calculate responsive drag handle margin
  useEffect(() => {
    const calculateMargin = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isTablet = screenWidth >= 768 && screenWidth < 1024;
      const isDesktop = screenWidth >= 1024;
     
      
      let calculatedMargin;
      
      if (isDesktop) {
        // Desktop: Fixed smaller margin since panel doesn't extend to bottom
        calculatedMargin = 32; // Similar to mt-8
      } else if (isTablet) {
        // Tablet: Medium margin based on height but more conservative
        if (screenHeight >= 1024) {
          calculatedMargin = 120; // For large tablets
        } else {
          calculatedMargin = 80; // For smaller tablets
        }
      } else {
        // Mobile: Proportional scaling based on height
        // At 932px height, we want ~264px (mt-66)
        // Scale proportionally: 264/932 ≈ 0.283
        calculatedMargin = screenHeight * 0.283;
      }
      
      // Ensure reasonable bounds
      const finalMargin = Math.max(16, Math.min(400, calculatedMargin));
      setDragHandleMargin(finalMargin);
    };

    calculateMargin();
    window.addEventListener('resize', calculateMargin);
    return () => window.removeEventListener('resize', calculateMargin);
  }, []);

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
          transition: dragOffset > 0 ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: dragOffset > 0 ? 1 : 0,
          pointerEvents: dragOffset > 0 ? 'auto' : 'none',
          cursor: dragOffset > 0 ? 'grabbing' : 'grab',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none',
          overscrollBehavior: 'none'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-6 max-h-full overflow-y-auto overscroll-none scrollbar-hide flex flex-col">
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
              <Settings aria-label="Settings" size={20} />
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

          {/* Media Player */}
          <MediaPlayer 
            currentSong={currentSong}
            isPlaying={isPlaying}
            onTogglePlay={togglePlayPause}
            onSkipForward={handleSkipForward}
            onSkipBack={handleSkipBack}
            onProgressClick={handleProgressClick}
            onOpenModal={() => setShowSpotifyModal(true)}
            formatTime={formatTime}
          />

          {/* Brightness Slider */}
          <Slider 
            label="Brightness"
            value={brightness}
            min={20}
            max={100}
            onChange={handleBrightnessChange}
          />

          {/* Volume Slider */}
          <Slider 
            label="Volume"
            value={volume}
            min={0}
            max={100}
            onChange={handleVolumeChange}
            icon={<Volume2 size={16} />}
          />

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

        {/* Bottom Drag Handle - Responsive positioning */}
        <div className="flex justify-center mb-4" style={{
          marginTop: `${dragHandleMargin}px`
        }}>
          <div className="w-12 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Spotify Modal */}
      <SpotifyModal 
        isOpen={showSpotifyModal}
        onClose={() => setShowSpotifyModal(false)}
        onSongSelect={handleSongSelectWithToggle}
        playlist={playlist}
        formatTime={formatTime}
      />

      {/* Overlay when quick settings is open */}
      {dragOffset > 0 && (
        <div 
          className="fixed inset-0 bg-black/40 z-10 touch-manipulation" 
          onClick={() => setDragOffset(0)} 
        />
      )}

      <style>{sliderStyles}</style>
    </>
  );
}
