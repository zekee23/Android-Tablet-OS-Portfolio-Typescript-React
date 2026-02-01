import { useState, useEffect, useCallback } from 'react';

export function useBattery() {
  const [percentage, setPercentage] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  // Simulate battery drain (1% every 1 second for testing)
  const startBatteryDrain = useCallback(() => {
    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000); // 1 second = 1000ms

    return interval;
  }, []);

  // Start simulation on mount
  useEffect(() => {
    const interval = startBatteryDrain();
    return () => clearInterval(interval);
  }, [startBatteryDrain]);

  // Manual controls for testing
  const chargeBattery = useCallback(() => {
    setIsCharging(true);
    setPercentage(100);
    setTimeout(() => setIsCharging(false), 1000);
  }, []);

  const drainBattery = useCallback((amount: number) => {
    setPercentage(prev => Math.max(0, prev - amount));
  }, []);

  return {
    percentage,
    isCharging,
    chargeBattery,
    drainBattery
  };
}
