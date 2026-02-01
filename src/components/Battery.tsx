import { Battery, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

interface BatteryProps {
  percentage: number;
  size?: number;
  showPercentage?: boolean;
  className?: string;
}

export function BatteryIcon({ 
  percentage, 
  size = 16, 
  showPercentage = true, 
  className = "" 
}: BatteryProps) {
  // Determine battery color based on percentage
  const getBatteryColor = (percent: number) => {
    if (percent <= 20) return 'text-red-500';
    if (percent <= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Determine which icon to use based on percentage
  const getBatteryIcon = (percent: number) => {
    if (percent <= 20) return BatteryLow;
    if (percent <= 50) return BatteryMedium;
    if (percent <= 80) return Battery;
    return BatteryFull;
  };

  const BatteryIconComponent = getBatteryIcon(percentage);
  const batteryColor = getBatteryColor(percentage);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <BatteryIconComponent 
        size={size} 
        className={batteryColor}
      />
      {showPercentage && (
        <span className={`text-xs ${batteryColor} font-medium`}>
          {percentage}%
        </span>
      )}
    </div>
  );
}
