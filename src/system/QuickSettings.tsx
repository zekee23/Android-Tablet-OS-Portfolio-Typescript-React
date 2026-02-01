import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Wifi, Bluetooth, Volume2, Settings, Flashlight, Plane, RotateCw, Bell, BellOff } from 'lucide-react';
import { useQuickSettings } from '../hooks/useQuickSettings';
import { BatteryIcon } from '../components/Battery';
import { useBattery } from '../hooks/useBattery';

export function QuickSettings() {
  const { isOpen, close } = useQuickSettings();
  const { percentage: batteryPercentage, isCharging } = useBattery();
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [brightness, setBrightness] = useState(50);
  const [volume, setVolume] = useState(70);
  const startY = useRef(0);
  const initialDragOffset = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const brightnessTimeoutRef = useRef<number | null>(null);
  const volumeTimeoutRef = useRef<number | null>(null);
  
  const [toggles, setToggles] = useState({
    wifi: true,
    bluetooth: false,
    airplane: false,
    flashlight: false,
    autoRotate: true,
    dnd: false,
    location: true
  });

  type ToggleKey = keyof typeof toggles;

  const handleToggle = (key: ToggleKey) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
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
    // Prevent dragging if clicking on interactive elements
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
    
    // Calculate new drag offset
    let newOffset = initialDragOffset.current + deltaY;
    
    // Clamp between 0 and 600
    newOffset = Math.max(0, Math.min(600, newOffset));
    
    setDragOffset(newOffset);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Snap based on current position
    if (dragOffset > 300) {
      setDragOffset(600);
    } else {
      setDragOffset(0);
    }
  }, [isDragging, dragOffset]);

  // Add touch event listeners with passive: false
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleTouchStartPassive = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('button, input[type="range"]')) {
        return;
      }
      e.preventDefault();
      const touch = e.touches[0];
      startY.current = touch.clientY;
      initialDragOffset.current = dragOffset;
      setIsDragging(true);
    };

    const handleTouchMovePassive = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const deltaY = currentY - startY.current;
      
      let newOffset = initialDragOffset.current + deltaY;
      newOffset = Math.max(0, Math.min(600, newOffset));
      
      setDragOffset(newOffset);
    };

    const handleTouchEndPassive = () => {
      if (!isDragging) return;
      setIsDragging(false);
      
      if (dragOffset > 300) {
        setDragOffset(600);
      } else {
        setDragOffset(0);
      }
    };

    panel.addEventListener('touchstart', handleTouchStartPassive, { passive: false });
    panel.addEventListener('touchmove', handleTouchMovePassive, { passive: false });
    panel.addEventListener('touchend', handleTouchEndPassive, { passive: false });

    return () => {
      panel.removeEventListener('touchstart', handleTouchStartPassive);
      panel.removeEventListener('touchmove', handleTouchMovePassive);
      panel.removeEventListener('touchend', handleTouchEndPassive);
    };
  }, [dragOffset, isDragging]);

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      const handleMove = (e: MouseEvent) => handleMouseMove(e);
      const handleUp = () => handleMouseUp();
      
      // Prevent text selection while dragging
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

  // Sync dragOffset with isOpen state
  useEffect(() => {
    if (dragOffset === 0 && isOpen) {
      close();
    }
  }, [dragOffset, isOpen, close]);

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
      className={`flex flex-col items-center justify-center rounded-2xl p-4 transition-all ${
        active ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/90 hover:bg-white/20'
      }`}
    >
      <Icon size={24} strokeWidth={2} />
      <span className="text-xs mt-2 font-medium">{label}</span>
    </button>
  );

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      {/* Status Bar - Drag from here */}
      <div 
        className="fixed top-0 left-0 right-0 z-30 px-6 py-3 flex items-center justify-between text-white cursor-pointer bg-black/20 backdrop-blur-sm select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="text-sm font-medium">{currentTime}</div>
        <div className="flex items-center gap-2">
          {toggles.wifi && <Wifi size={16} />}
          {toggles.bluetooth && <Bluetooth size={16} />}
          <BatteryIcon percentage={batteryPercentage} size={16} showPercentage={false} />
        </div>
      </div>

      {/* Quick Settings Panel */}
      <div 
        ref={panelRef}
        className="fixed left-0 right-0 z-20 bg-gradient-to-b from-slate-900/98 to-slate-800/98 backdrop-blur-xl shadow-2xl select-none"
        style={{
          top: '-600px',
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: dragOffset > 0 ? 1 : 0,
          pointerEvents: dragOffset > 0 ? 'auto' : 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="px-6 pt-8 pb-8">
          {/* Drag Handle */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
          </div>
          
          {/* Date and Settings */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-white">
              <div className="text-3xl font-light">{currentTime}</div>
              <div className="text-sm text-white/60 mt-1">{currentDate}</div>
            </div>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>

          {/* Quick Settings Tiles */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <QuickSettingTile 
              icon={Wifi} 
              label="Wi-Fi" 
              active={toggles.wifi} 
              onClick={() => handleToggle('wifi')} 
            />
            <QuickSettingTile 
              icon={Bluetooth} 
              label="Bluetooth" 
              active={toggles.bluetooth} 
              onClick={() => handleToggle('bluetooth')} 
            />
            <QuickSettingTile 
              icon={Plane} 
              label="Airplane" 
              active={toggles.airplane} 
              onClick={() => handleToggle('airplane')} 
            />
            <QuickSettingTile 
              icon={Flashlight} 
              label="Flashlight" 
              active={toggles.flashlight} 
              onClick={() => handleToggle('flashlight')} 
            />
            <QuickSettingTile 
              icon={RotateCw} 
              label="Auto-rotate" 
              active={toggles.autoRotate} 
              onClick={() => handleToggle('autoRotate')} 
            />
            <QuickSettingTile 
              icon={toggles.dnd ? BellOff : Bell} 
              label="DND" 
              active={toggles.dnd} 
              onClick={() => handleToggle('dnd')} 
            />
          </div>

          {/* Brightness Slider */}
          <div className="mb-4 bg-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm font-medium">Brightness</span>
              <span className="text-white/60 text-xs">{brightness}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={brightness} 
              onChange={(e) => handleBrightnessChange(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${brightness}%, rgba(255,255,255,0.2) ${brightness}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>

          {/* Volume Slider */}
          <div className="mb-4 bg-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm font-medium flex items-center gap-2">
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
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>

          {/* Battery Info */}
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BatteryIcon percentage={batteryPercentage} size={20} showPercentage={false} />
                <span className="text-white/80 text-sm font-medium">
                  Battery
                </span>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-xs">
                  {batteryPercentage}%
                </div>
                <div className="text-white/40 text-xs">
                  {isCharging ? 'Full charge in 45 min' : `${Math.floor(batteryPercentage * 0.6)}h remaining`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when quick settings is open */}
      {dragOffset > 0 && (
        <div 
          className="fixed inset-0 bg-black/40 z-10" 
          onClick={() => {
            setDragOffset(0);
          }} 
        />
      )}

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 2px;
        }
        input[type="range"]::-moz-range-track {
          height: 4px;
          border-radius: 2px;
        }
      `}</style>
    </>
  );
}