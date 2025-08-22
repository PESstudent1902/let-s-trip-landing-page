import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DiceProps {
  value?: number;
  isRolling: boolean;
  onRollComplete?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'fire' | 'ice' | 'golden';
}

const diceFaces = {
  1: [
    [false, false, false],
    [false, true, false],
    [false, false, false]
  ],
  2: [
    [true, false, false],
    [false, false, false],
    [false, false, true]
  ],
  3: [
    [true, false, false],
    [false, true, false],
    [false, false, true]
  ],
  4: [
    [true, false, true],
    [false, false, false],
    [true, false, true]
  ],
  5: [
    [true, false, true],
    [false, true, false],
    [true, false, true]
  ],
  6: [
    [true, false, true],
    [true, false, true],
    [true, false, true]
  ]
};

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32'
};

const dotSizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4'
};

const variantClasses = {
  default: 'bg-card border-primary shadow-lg',
  fire: 'bg-red-500 border-red-400 shadow-red-500/25',
  ice: 'bg-blue-400 border-blue-300 shadow-blue-400/25',
  golden: 'bg-yellow-400 border-yellow-300 shadow-yellow-400/25'
};

export default function Dice({ 
  value = 1, 
  isRolling, 
  onRollComplete, 
  size = 'md',
  variant = 'default' 
}: DiceProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [rollCount, setRollCount] = useState(0);

  useEffect(() => {
    if (isRolling) {
      setRollCount(0);
      const rollInterval = setInterval(() => {
        setRollCount(prev => {
          const newCount = prev + 1;
          setCurrentValue(Math.floor(Math.random() * 6) + 1);

          if (newCount >= 8) {
            clearInterval(rollInterval);
            // Always return the initial value passed to component (1-6)
            const finalValue = Math.min(Math.max(value, 1), 6);
            setCurrentValue(finalValue);
            setTimeout(() => onRollComplete?.(finalValue), 100);
          }

          return newCount;
        });
      }, 80);

      return () => clearInterval(rollInterval);
    }
  }, [isRolling, onRollComplete]);

  const face = diceFaces[currentValue as keyof typeof diceFaces];

  return (
    <div
      className={cn(
        'relative rounded-xl border-4 flex flex-col justify-between p-2 transition-all duration-300',
        sizeClasses[size],
        variantClasses[variant],
        isRolling && 'animate-dice-roll',
        'hover:scale-105 cursor-pointer'
      )}
    >
      {face.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-between">
          {row.map((dot, dotIndex) => (
            <div
              key={dotIndex}
              className={cn(
                'rounded-full transition-all duration-200',
                dotSizeClasses[size],
                dot ? 'bg-foreground' : 'bg-transparent'
              )}
            />
          ))}
        </div>
      ))}
      
      {isRolling && (
        <div className="absolute inset-0 bg-primary/20 rounded-xl animate-pulse-glow" />
      )}
    </div>
  );
}
