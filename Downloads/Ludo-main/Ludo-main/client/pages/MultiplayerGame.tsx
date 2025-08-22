import { useState, useEffect } from 'react';
import { socketService } from '@/services/socket';
import { GameState, gameScenarios, AnswerSubmission } from '@shared/gameData';
import TeamAuth from '@/components/TeamAuth';
import TeamTaskView from '@/components/TeamTaskView';
import AdminDashboard from '@/components/AdminDashboard';
import MultiplayerDice from '@/components/MultiplayerDice';
import { toast } from '@/hooks/use-toast';

export default function MultiplayerGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [availableScenarios, setAvailableScenarios] = useState<number[]>([]);
  const [playerAnswers, setPlayerAnswers] = useState<Array<{
    playerId: string;
    playerName: string;
    answer: any;
  }>>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [userType, setUserType] = useState<'team' | 'admin' | null>(null);

  // Initialize socket connection
  useEffect(() => {
    socketService.connect();

    // Set up event listeners
    socketService.on('gameState', (newGameState: GameState) => {
      setGameState(newGameState);
    });

    socketService.on('playerJoined', (data: { playerId: string; isAdmin: boolean }) => {
      setPlayerId(data.playerId);
      setIsAdmin(data.isAdmin);
      setIsConnecting(false);
      setError(null);
      
      if (data.isAdmin) {
        socketService.getAvailableScenarios();
      }
    });

    socketService.on('availableScenarios', (scenarios: number[]) => {
      setAvailableScenarios(scenarios);
    });

    socketService.on('playerAnswered', (data: any) => {
      setPlayerAnswers(prev => [...prev, data]);
    });

    socketService.on('answerSubmitted', () => {
      setIsSubmitting(false);
      toast({
        title: "Answer Submitted",
        description: "Your team's answer has been recorded successfully!",
      });
    });

    socketService.on('eliminated', () => {
      toast({
        title: "Team eliminated",
        description: "Your team has been eliminated from the game.",
        variant: "destructive",
      });
    });

    socketService.on('error', (error: { message: string }) => {
      setError(error.message);
      setIsConnecting(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Calculate time left for questions
  useEffect(() => {
    if (gameState?.phase === 'question' && gameState.questionStartTime) {
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
  }, [gameState?.phase, gameState?.questionStartTime]);

  // Update available scenarios when game state changes
  useEffect(() => {
    if (isAdmin && gameState) {
      socketService.getAvailableScenarios();
    }
  }, [isAdmin, gameState?.usedScenarios]);

  const handleJoinGame = (name: string, isAdminJoin = false, adminUsername?: string, adminPassword?: string, teamName?: string) => {
    setIsConnecting(true);
    setError(null);
    socketService.joinGame(name, isAdminJoin, adminUsername, adminPassword, teamName);
  };

  const handleTeamLogin = (teamNameInput: string, playerNameInput: string) => {
    setTeamName(teamNameInput);
    setPlayerName(playerNameInput);
    setUserType('team');
    handleJoinGame(playerNameInput, false, undefined, undefined, teamNameInput);
  };

  const handleAdminLogin = (username: string, password: string) => {
    setUserType('admin');
    handleJoinGame('Game Admin', true, username, password);
  };

  const handleRollDice = (targetNumber: number) => {
    socketService.rollDice(targetNumber);
  };

  const handleSubmitAnswer = (answer: AnswerSubmission) => {
    setIsSubmitting(true);
    socketService.submitAnswer(answer);
  };

  const handleEliminatePlayer = (playerId: string) => {
    socketService.eliminatePlayer(playerId);
  };

  const handleEndQuestion = () => {
    socketService.endQuestion();
  };

  const handleResetGame = () => {
    socketService.resetGame();
    setPlayerAnswers([]);
  };

  // Show team auth if not connected
  if (!playerId || !gameState) {
    if (userType === null) {
      return (
        <TeamAuth
          onTeamLogin={handleTeamLogin}
          onAdminLogin={handleAdminLogin}
          isConnecting={isConnecting}
          error={error}
        />
      );
    }
    
    // Show loading while connecting
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-foreground">
            {userType === 'admin' ? 'Loading Admin Panel...' : 'Joining Team...'}
          </div>
          <div className="text-muted-foreground">
            {userType === 'admin' ? 'Setting up your control panel' : `Connecting ${playerName} to team ${teamName}`}
          </div>
        </div>
      </div>
    );
  }

  const currentScenario = gameState.currentScenario 
    ? gameScenarios.find(s => s.id === gameState.currentScenario)
    : null;

  const currentPlayer = gameState.players[playerId];
  const hasSubmitted = currentPlayer && gameState.currentScenario
    ? currentPlayer.answers.some(a => a.scenarioId === gameState.currentScenario)
    : false;

  // Show dice rolling animation
  if (gameState.phase === 'rolling') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Dice is rolling...
            </h1>
            <p className="text-muted-foreground text-lg">
              Get ready for your next challenge!
            </p>
          </div>

          <MultiplayerDice
            value={gameState.diceResult || 1}
            isRolling={gameState.isRolling}
            size="xl"
          />

          <div className="text-sm text-muted-foreground">
            Prepare for the upcoming scenario
          </div>
        </div>
      </div>
    );
  }

  // Show task view for teams when scenario is active
  if (gameState.phase === 'question' && currentScenario && userType === 'team') {
    return (
      <TeamTaskView
        scenario={currentScenario}
        timeLeft={timeLeft}
        onSubmitAnswer={handleSubmitAnswer}
        hasSubmitted={hasSubmitted}
        isSubmitting={isSubmitting}
        teamName={teamName}
        playerName={playerName}
        diceResult={gameState.diceResult || 0}
      />
    );
  }

  // Show different views based on user type
  if (userType === 'admin') {
    return (
      <AdminDashboard
        gameState={gameState}
        playerId={playerId}
        onRollDice={handleRollDice}
        onEliminatePlayer={handleEliminatePlayer}
        onEndQuestion={handleEndQuestion}
        onResetGame={handleResetGame}
        availableScenarios={availableScenarios}
        playerAnswers={playerAnswers}
      />
    );
  }

  // Team waiting screen
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Monopoly Madness</h1>
          <p className="text-muted-foreground">Team Challenge Arena</p>
        </div>

        <div className="bg-card border rounded-xl p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold text-foreground">Team: {teamName}</div>
            <div className="text-muted-foreground">Player: {playerName}</div>
          </div>

          <div className="text-center space-y-4">
            {gameState.phase === 'rolling' ? (
              <>
                <div className="text-xl font-bold text-foreground">🎲 Dice is rolling...</div>
                <div className="text-muted-foreground">Get ready for your challenge!</div>
              </>
            ) : gameState.phase === 'results' ? (
              <>
                <div className="text-xl font-bold text-foreground">📊 Reviewing answers...</div>
                <div className="text-muted-foreground">Results coming up next!</div>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-foreground">⏳ Waiting for admin...</div>
                <div className="text-muted-foreground">The admin will roll the dice soon to reveal your next challenge</div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-primary">{gameState.usedScenarios.length}/25</div>
              <div className="text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="font-semibold text-primary">{25 - gameState.usedScenarios.length}</div>
              <div className="text-muted-foreground">Remaining</div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-foreground">Team Instructions</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Work together with your team members</p>
              <p>• You'll have 1 minute to answer each challenge</p>
              <p>• Discuss options before submitting your final answer</p>
              <p>• Only one answer per team - make it count!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
