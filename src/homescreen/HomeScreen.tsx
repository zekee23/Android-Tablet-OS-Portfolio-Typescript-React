import { AppGrid } from './AppGrid';
import { useOS } from '../hooks/useOS';
import { LiveWallpaper } from '../styles/Livewallpaper';
import type { App } from '../app/types';
import { useState, useEffect } from 'react';

interface HomeScreenProps {
  apps: App[];
}

export function HomeScreen({ apps }: HomeScreenProps) {
  const { actions } = useOS();
  const [currentTime, setCurrentTime] = useState(() =>
    typeof window !== 'undefined'
      ? new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '00:00'
  );
  const [currentDate, setCurrentDate] = useState(() =>
    typeof window !== 'undefined'
      ? new Date().toLocaleDateString('en-PH', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      : 'Loading...'
  );

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }));
      
      setCurrentDate(new Date().toLocaleDateString('en-PH', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }));
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden select-none">
      {/* Live Interactive Wallpaper */}
      <LiveWallpaper />
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/30 pointer-events-none"></div>
      
      {/* Home Screen Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-16 pb-16">
        <div className="text-center text-white mb-12">
          <h1 className="text-6xl font-extralight mb-2 drop-shadow-lg" style={{ fontDisplay: 'swap' } as React.CSSProperties}>
            {currentTime}
          </h1>
          <p className="text-xl text-white/70 font-light drop-shadow-md">
            {currentDate}
          </p>
          <p className="text-l text-white/70 font-light drop-shadow-md">Manila, Philippines</p>
        </div>
        
        <div className="w-full max-w-md pt-7">
          <AppGrid apps={apps} onAppClick={actions.openApp} />
        </div>
        
        <div className="mt-8 space-y-2">
          <p className="text-sm text-white/70 text-center drop-shadow-md">Drag down from the status bar</p>
          <p className="text-xs text-white/50 text-center drop-shadow-md">to open Quick Settings</p>
        </div>
      </div>
    </div>
  );
}