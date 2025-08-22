import { Trophy, Target, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameStatsProps {
  wins: number;
  totalGames: number;
  streak: number;
  bestTime: number;
  className?: string;
}

export default function GameStats({ 
  wins, 
  totalGames, 
  streak, 
  bestTime, 
  className 
}: GameStatsProps) {
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const stats = [
    {
      icon: Trophy,
      label: 'Win Rate',
      value: `${winRate}%`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: Target,
      label: 'Total Games',
      value: totalGames.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Zap,
      label: 'Win Streak',
      value: streak.toString(),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Clock,
      label: 'Best Time',
      value: bestTime > 0 ? formatTime(bestTime) : '--',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={cn(
              'relative overflow-hidden rounded-xl border border-border p-4 transition-all duration-300',
              'hover:scale-105 hover:border-primary/50 cursor-pointer',
              stat.bgColor
            )}
          >
            <div className="flex items-center space-x-3">
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <Icon className={cn('w-5 h-5', stat.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-20 h-20 bg-primary/20 rounded-full blur-xl" />
          </div>
        );
      })}
    </div>
  );
}
