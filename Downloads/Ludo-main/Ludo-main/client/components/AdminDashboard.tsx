import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameState, gameScenarios, Player } from '@shared/gameData';
import { 
  Crown, 
  Dice6, 
  Users, 
  Ban, 
  RotateCcw, 
  Play, 
  Pause,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
  gameState: GameState;
  playerId: string;
  onRollDice: (targetNumber: number) => void;
  onEliminatePlayer: (playerId: string) => void;
  onEndQuestion: () => void;
  onResetGame: () => void;
  availableScenarios: number[];
  playerAnswers: Array<{
    playerId: string;
    playerName: string;
    answer: any;
  }>;
}

export default function AdminDashboard({
  gameState,
  playerId,
  onRollDice,
  onEliminatePlayer,
  onEndQuestion,
  onResetGame,
  availableScenarios,
  playerAnswers
}: AdminDashboardProps) {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Calculate time left
  useEffect(() => {
    if (gameState.phase === 'question' && gameState.questionStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameState.questionStartTime!) / 1000);
        const remaining = Math.max(0, 60 - elapsed);
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState.phase, gameState.questionStartTime]);

  const activePlayers = Object.values(gameState.players).filter(p => !p.isAdmin && p.connected && !p.eliminated);
  const currentScenario = gameState.currentScenario ? gameScenarios.find(s => s.id === gameState.currentScenario) : null;
  const usedCount = gameState.usedScenarios.length;
  const remainingCount = 25 - usedCount;

  const handleRollDice = () => {
    if (selectedScenario && availableScenarios.includes(selectedScenario)) {
      onRollDice(selectedScenario);
      setSelectedScenario(null);
    }
  };

  const getPhaseDisplay = () => {
    switch (gameState.phase) {
      case 'lobby': return { text: 'Lobby', color: 'bg-blue-500' };
      case 'waiting': return { text: 'Waiting', color: 'bg-yellow-500' };
      case 'rolling': return { text: 'Rolling Dice', color: 'bg-purple-500' };
      case 'question': return { text: 'Question Active', color: 'bg-green-500' };
      case 'results': return { text: 'Showing Results', color: 'bg-orange-500' };
      case 'finished': return { text: 'Game Finished', color: 'bg-red-500' };
      default: return { text: 'Unknown', color: 'bg-gray-500' };
    }
  };

  const phaseDisplay = getPhaseDisplay();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary rounded-xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Monopoly Madness - Admin</h1>
                <p className="text-muted-foreground">Full control over the Monopoly Madness game</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className={cn("px-3 py-1", phaseDisplay.color, "text-white")}>
                {phaseDisplay.text}
              </Badge>
              <Button variant="outline" onClick={onResetGame}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Game
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{activePlayers.length}</div>
                <div className="text-sm text-muted-foreground">Active Players</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Dice6 className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold">{usedCount}/25</div>
                <div className="text-sm text-muted-foreground">Scenarios Used</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold">{playerAnswers.length}</div>
                <div className="text-sm text-muted-foreground">Recent Answers</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold">
                  {gameState.phase === 'question' ? `${timeLeft}s` : '--'}
                </div>
                <div className="text-sm text-muted-foreground">Time Left</div>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="control" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="control">Game Control</TabsTrigger>
            <TabsTrigger value="players">Player Management</TabsTrigger>
            <TabsTrigger value="answers">Live Answers</TabsTrigger>
          </TabsList>

          {/* Game Control Tab */}
          <TabsContent value="control" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Dice Control */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Dice Control</h3>
                
                {gameState.phase === 'waiting' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Select Scenario (1-25):
                      </label>
                      <div className="grid grid-cols-5 gap-2 mt-2 max-h-32 overflow-y-auto">
                        {availableScenarios.map((num) => (
                          <Button
                            key={num}
                            variant={selectedScenario === num ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedScenario(num)}
                            className="aspect-square text-xs"
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">How it works:</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>• Dice shows 1-6 (traditional dice)</div>
                        <div>• Teams see dice result + selected scenario</div>
                        <div>• All 25 scenarios available to choose from</div>
                      </div>
                    </div>

                    <Button
                      onClick={handleRollDice}
                      disabled={!selectedScenario}
                      className="w-full"
                      size="lg"
                    >
                      <Dice6 className="w-4 h-4 mr-2" />
                      Roll Dice (1-6) → Scenario {selectedScenario || '?'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Dice6 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div>Cannot roll dice during {gameState.phase} phase</div>
                  </div>
                )}
              </Card>

              {/* Current Question */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Current Question</h3>
                
                {currentScenario ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-primary">
                        Dice: {gameState.diceResult} | Scenario #{currentScenario.id}
                      </div>
                      <div className="font-semibold">{currentScenario.title}</div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {currentScenario.scenario}
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Task:</span> {currentScenario.task}
                    </div>

                    {gameState.phase === 'question' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Time Remaining:</span>
                          <span className={cn(
                            "font-bold",
                            timeLeft <= 10 ? "text-red-400" : "text-foreground"
                          )}>
                            {timeLeft}s
                          </span>
                        </div>
                        
                        <Button
                          onClick={onEndQuestion}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          End Question Early
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div>No active question</div>
                  </div>
                )}
              </Card>
            </div>

            {/* Progress */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Game Progress</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Scenarios Completed</span>
                  <span>{usedCount}/25</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(usedCount / 25) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Remaining scenarios: {availableScenarios.join(', ') || 'None'}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Player Management</h3>
              
              <div className="space-y-4">
                {activePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        player.connected ? "bg-green-400" : "bg-red-400"
                      )} />
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Score: {player.score} • Answered: {player.answers.length}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onEliminatePlayer(player.id)}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Eliminate
                    </Button>
                  </div>
                ))}

                {activePlayers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div>No active players</div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Answers Tab */}
          <TabsContent value="answers" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Live Answer Monitoring</h3>
              
              <div className="space-y-4">
                {playerAnswers.length > 0 ? (
                  playerAnswers.slice(-10).reverse().map((submission, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{submission.playerName}</span>
                        <Badge variant="outline">
                          Scenario #{submission.answer.scenarioId}
                        </Badge>
                      </div>
                      
                      {submission.answer.selectedOption && (
                        <div className="text-sm">
                          <span className="font-medium">Selected:</span> {submission.answer.selectedOption}
                        </div>
                      )}
                      
                      <div className="text-sm">
                        <span className="font-medium">Justification:</span> {submission.answer.justification}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div>No answers submitted yet</div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
