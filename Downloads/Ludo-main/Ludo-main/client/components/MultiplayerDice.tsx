import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MultiplayerDiceProps {
  value?: number;
  isRolling: boolean;
  onRollComplete?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-16 h-16 text-lg',
  md: 'w-24 h-24 text-xl',
  lg: 'w-32 h-32 text-2xl',
  xl: 'w-48 h-48 text-4xl'
};

export default function MultiplayerDice({ 
  value = 1, 
  isRolling, 
  onRollComplete, 
  size = 'xl'
}: MultiplayerDiceProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [rollCount, setRollCount] = useState(0);

  useEffect(() => {
    if (isRolling) {
      setRollCount(0);
      const rollInterval = setInterval(() => {
        setRollCount(prev => {
          const newCount = prev + 1;
          setCurrentValue(Math.floor(Math.random() * 6) + 1); // Only show 1-6

          if (newCount >= 12) { // Longer animation for dramatic effect
            clearInterval(rollInterval);
            setTimeout(() => {
              // Show final dice result (1-6) regardless of actual scenario
              const finalDiceValue = Math.floor(Math.random() * 6) + 1;
              setCurrentValue(finalDiceValue);
              onRollComplete?.(finalDiceValue);
            }, 100);
          }

          return newCount;
        });
      }, 150);

      return () => clearInterval(rollInterval);
    }
  }, [isRolling, value, onRollComplete]);

  useEffect(() => {
    if (!isRolling) {
      setCurrentValue(value);
    }
  }, [value, isRolling]);

  return (
    <div className="relative flex justify-center">
      {/* Glow effect */}
      {isRolling && (
        <div className="absolute inset-0 animate-pulse-glow">
          <div className={cn(
            'rounded-xl bg-primary/50 blur-xl',
            sizeClasses[size]
          )} />
        </div>
      )}
      
      {/* Main dice */}
      <div
        className={cn(
          'relative rounded-xl border-4 flex items-center justify-center transition-all duration-300 font-bold bg-card',
          sizeClasses[size],
          isRolling && 'animate-dice-roll border-primary shadow-lg shadow-primary/25',
          !isRolling && 'border-border hover:border-primary/50 cursor-pointer'
        )}
      >
        {/* Number display */}
        <div className={cn(
          'font-bold text-primary',
          isRolling && 'animate-bounce-in'
        )}>
          {currentValue}
        </div>

        {/* Corner decorations */}
        <div className="absolute top-1 left-1">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
        <div className="absolute bottom-1 left-1">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>

        {/* Rolling overlay */}
        {isRolling && (
          <div className="absolute inset-0 bg-primary/20 rounded-xl animate-pulse" />
        )}
      </div>

      {/* Value range indicator */}
      {!isRolling && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-xs text-muted-foreground bg-card px-2 py-1 rounded border">
            1-6
          </div>
        </div>
      )}
    </div>
  );
}
