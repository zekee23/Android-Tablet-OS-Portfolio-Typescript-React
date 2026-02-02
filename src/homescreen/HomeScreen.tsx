import { AppGrid } from './AppGrid';
import { useOS } from '../hooks/useOS';
import type { App } from '../app/types';

interface HomeScreenProps {
  apps: App[];
}

export function HomeScreen({ apps }: HomeScreenProps) {
  const { actions } = useOS();

  const handleAppClick = (appId: string) => {
    actions.openApp(appId);
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const currentDate = new Date().toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden select-none">
      {/* Wallpaper Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,179,237,0.2),transparent_50%)]"></div>
      </div>
      
      {/* Home Screen Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-16 pb-16">
        <div className="text-center text-white mb-12">
          <h1 className="text-6xl font-extralight mb-2">{currentTime}</h1>
          <p className="text-xl text-white/70 font-light">{currentDate}</p>
        </div>
        
        <div className="w-full max-w-md">
          <AppGrid apps={apps} onAppClick={handleAppClick} />
        </div>
        
        <div className="mt-8 space-y-2">
          <p className="text-sm text-white/70 text-center">👆 Drag down from the status bar</p>
          <p className="text-xs text-white/50 text-center">to open Quick Settings</p>
        </div>
      </div>
    </div>
  );
}
