interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
}

export function Slider({ label, value, min, max, onChange, icon }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="mb-3 bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 touch-manipulation">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/80 text-xs sm:text-sm font-medium flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className="text-white/60 text-xs">{value}%</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, rgba(255,255,255,0.2) ${percentage}%, rgba(255,255,255,0.2) 100%)`,
          touchAction: 'auto'
        }}
      />
    </div>
  );
}
