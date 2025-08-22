import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameState } from '@shared/gameData';
import { Users, Clock, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WaitingRoomProps {
  gameState: GameState;
  playerId: string;
}

export default function WaitingRoom({ gameState, playerId }: WaitingRoomProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const activePlayers = Object.values(gameState.players).filter(p => p.connected && !p.eliminated);
  const currentPlayer = gameState.players[playerId];
  const usedCount = gameState.usedScenarios.length;
  const remainingCount = 25 - usedCount;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Waiting Message */}
        <Card className="p-8 text-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">
                Wait till the dice are rolled{dots}
              </h1>
              <p className="text-muted-foreground text-lg">
                The admin will roll the dice to reveal your next Monopoly challenge
              </p>
            </div>

            {/* Animated waiting indicator */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl border-4 border-muted animate-pulse bg-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl font-bold text-muted-foreground">?</div>
                </div>
                <div className="absolute -inset-2 bg-primary rounded-xl opacity-75 blur animate-pulse-glow" />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Ready for scenario {usedCount + 1} of 25
            </div>
          </div>
        </Card>

        {/* Game Progress */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Game Progress</h3>
              <Badge variant="outline">
                {usedCount}/25 Complete
              </Badge>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(usedCount / 25) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-primary">{usedCount}</div>
                <div className="text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-accent">{remainingCount}</div>
                <div className="text-muted-foreground">Remaining</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Player Stats */}
        {currentPlayer && (
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                  </div>
                  <div className="font-semibold text-foreground">{currentPlayer.score}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="font-semibold text-foreground">{currentPlayer.answers.length}</div>
                  <div className="text-xs text-muted-foreground">Answered</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className={cn(
                      "p-2 rounded-lg",
                      currentPlayer.eliminated 
                        ? "bg-red-500/20" 
                        : "bg-green-500/20"
                    )}>
                      <Users className={cn(
                        "w-5 h-5",
                        currentPlayer.eliminated 
                          ? "text-red-400" 
                          : "text-green-400"
                      )} />
                    </div>
                  </div>
                  <div className="font-semibold text-foreground">
                    {currentPlayer.eliminated ? 'Eliminated' : 'Active'}
                  </div>
                  <div className="text-xs text-muted-foreground">Status</div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Active Players */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Players</h3>
              <Badge variant="secondary">
                <Users className="w-3 h-3 mr-1" />
                {activePlayers.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activePlayers.map((player) => (
                <div
                  key={player.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border",
                    player.id === playerId ? 'bg-primary/10 border-primary/50' : 'bg-card'
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    player.connected ? 'bg-green-400' : 'bg-red-400'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground truncate">
                        {player.name}
                      </span>
                      {player.isAdmin && (
                        <Badge variant="outline" className="text-xs">Admin</Badge>
                      )}
                      {player.id === playerId && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Score: {player.score} • Answered: {player.answers.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Tips */}
        <Card className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-medium text-foreground">Quick Tips</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Each scenario has a 60-second timer</p>
              <p>• Justifications must be 60 characters or less</p>
              <p>• Quick thinking and good reasoning earn points</p>
              <p>• Stay active to avoid elimination</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
