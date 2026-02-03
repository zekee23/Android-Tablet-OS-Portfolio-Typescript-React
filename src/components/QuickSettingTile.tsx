import type { QuickSettingTileProps } from '../system/types';

export function QuickSettingTile({ icon: Icon, label, active, onClick }: QuickSettingTileProps) {
  return (
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
}
