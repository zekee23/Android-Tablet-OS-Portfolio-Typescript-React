import { Wifi, Battery, Signal } from 'lucide-react';
import { useQuickSettings } from '../hooks/useQuickSettings';

export function StatusBar() {
  const { open } = useQuickSettings();

  const currentTime = new Date().toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  });

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-6 bg-black text-white text-xs flex items-center justify-between px-4 z-50 select-none"
      onClick={open}
    >
      <div className="flex items-center gap-1">
        <Signal className="w-3 h-3" />
        <Wifi className="w-3 h-3" />
      </div>
      
      <div className="font-medium">
        {currentTime}
      </div>
      
      <div className="flex items-center gap-1">
        <span className="text-xs">100%</span>
        <Battery className="w-3 h-3" />
      </div>
    </div>
  );
}
