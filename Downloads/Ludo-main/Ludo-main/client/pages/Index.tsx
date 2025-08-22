import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Dice from '@/components/Dice';
import GameStats from '@/components/GameStats';
import DecisionMaker from '@/components/DecisionMaker';
import { Sparkles, RotateCcw, Crown, Flame, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameState {
  wins: number;
  totalGames: number;
  streak: number;
  bestTime: number;
  currentScore: number;
  level: number;
  timeStarted: number | null;
}

interface Decision {
  id: string;
  text: string;
  type: 'good' | 'bad' | 'neutral';
  points: number;
}

const diceVariants = ['default', 'fire', 'ice', 'golden'] as const;
type DiceVariant = typeof diceVariants[number];

export default function Index() {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const [selectedDiceVariant, setSelectedDiceVariant] = useState<DiceVariant>('default');
  const [gameState, setGameState] = useState<GameState>({
    wins: 0,
    totalGames: 0,
    streak: 0,
    bestTime: 0,
    currentScore: 0,
    level: 1,
    timeStarted: null
  });
  const [recentDecision, setRecentDecision] = useState<{decision: Decision; points: number} | null>(null);

  useEffect(() => {
    // Load game state from localStorage
    const saved = localStorage.getItem('dice-decision-dash');
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load game state:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save game state to localStorage
    localStorage.setItem('dice-decision-dash', JSON.stringify(gameState));
  }, [gameState]);

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setShowDecision(false);
    setRecentDecision(null);
    
    if (!gameState.timeStarted) {
      setGameState(prev => ({ ...prev, timeStarted: Date.now() }));
    }
  };

  const handleRollComplete = (value: number) => {
    setDiceValue(value);
    setIsRolling(false);
    setShowDecision(true);
  };

  const handleDecisionMade = (decision: Decision, points: number) => {
    setRecentDecision({ decision, points });
    setShowDecision(false);
    
    const newScore = gameState.currentScore + points;
    const levelUp = newScore >= gameState.level * 100;
    
    setGameState(prev => {
      const isWin = newScore >= prev.level * 100;
      const gameTime = prev.timeStarted ? Math.floor((Date.now() - prev.timeStarted) / 1000) : 0;
      
      return {
        ...prev,
        currentScore: levelUp ? newScore - prev.level * 100 : newScore,
        level: levelUp ? prev.level + 1 : prev.level,
        wins: isWin ? prev.wins + 1 : prev.wins,
        totalGames: isWin ? prev.totalGames + 1 : prev.totalGames,
        streak: isWin ? prev.streak + 1 : (decision.type === 'bad' ? 0 : prev.streak),
        bestTime: isWin && gameTime > 0 && (prev.bestTime === 0 || gameTime < prev.bestTime) 
          ? gameTime : prev.bestTime,
        timeStarted: isWin ? null : prev.timeStarted
      };
    });
  };

  const resetGame = () => {
    setGameState({
      wins: 0,
      totalGames: 0,
      streak: 0,
      bestTime: 0,
      currentScore: 0,
      level: 1,
      timeStarted: null
    });
    setDiceValue(1);
    setShowDecision(false);
    setRecentDecision(null);
  };

  const variantIcons = {
    default: Sparkles,
    fire: Flame,
    ice: Snowflake,
    golden: Crown
  };

  const variantNames = {
    default: 'Classic',
    fire: 'Fire',
    ice: 'Ice',
    golden: 'Golden'
  };

  const progressPercentage = (gameState.currentScore / (gameState.level * 100)) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary rounded-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  Dice Decision Dash
                </h1>
                <p className="text-muted-foreground">Roll • Decide • Conquer</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={resetGame}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Game</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Game Stats */}
        <GameStats
          wins={gameState.wins}
          totalGames={gameState.totalGames}
          streak={gameState.streak}
          bestTime={gameState.bestTime}
        />

        {/* Level Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Level {gameState.level}</h3>
              <p className="text-muted-foreground">
                {gameState.currentScore} / {gameState.level * 100} points
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {gameState.currentScore}
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </Card>

        {/* Dice Variants */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Choose Your Dice</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {diceVariants.map((variant) => {
              const Icon = variantIcons[variant];
              return (
                <Button
                  key={variant}
                  variant={selectedDiceVariant === variant ? "default" : "outline"}
                  onClick={() => setSelectedDiceVariant(variant)}
                  className="h-20 flex flex-col space-y-2"
                  disabled={isRolling}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm">{variantNames[variant]}</span>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Main Game Area */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Dice Rolling Section */}
          <Card className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Roll the Dice</h2>
              <p className="text-muted-foreground">
                Click the dice to roll and make your next decision
              </p>
            </div>

            <div className="flex justify-center">
              <div onClick={rollDice} className="cursor-pointer">
                <Dice
                  value={diceValue}
                  isRolling={isRolling}
                  onRollComplete={handleRollComplete}
                  size="lg"
                  variant={selectedDiceVariant}
                />
              </div>
            </div>

            <Button
              onClick={rollDice}
              disabled={isRolling || showDecision}
              size="lg"
              className="w-full text-lg font-semibold"
            >
              {isRolling ? 'Rolling...' : showDecision ? 'Make Your Decision' : 'Roll Dice'}
            </Button>

            {recentDecision && (
              <div className="animate-bounce-in">
                <Card className={cn(
                  'p-4 border-2',
                  recentDecision.decision.type === 'good' && 'border-green-400 bg-green-400/10',
                  recentDecision.decision.type === 'bad' && 'border-red-400 bg-red-400/10',
                  recentDecision.decision.type === 'neutral' && 'border-blue-400 bg-blue-400/10'
                )}>
                  <div className="text-center">
                    <div className="font-semibold">
                      {recentDecision.decision.text}
                    </div>
                    <div className={cn(
                      'text-2xl font-bold mt-2',
                      recentDecision.points > 0 ? 'text-green-400' : 'text-red-400'
                    )}>
                      {recentDecision.points > 0 ? '+' : ''}{recentDecision.points} points
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </Card>

          {/* Decision Making Section */}
          <div className="lg:sticky lg:top-24">
            {showDecision ? (
              <DecisionMaker
                diceValue={diceValue}
                onDecisionMade={handleDecisionMade}
                isVisible={showDecision}
              />
            ) : (
              <Card className="p-8 text-center">
                <div className="space-y-4 opacity-50">
                  <h3 className="text-xl font-semibold">Waiting for dice roll...</h3>
                  <p className="text-muted-foreground">
                    Roll the dice to see your decision options
                  </p>
                  <div className="w-24 h-24 mx-auto bg-muted rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* How to Play */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">How to Play</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-primary">1. Roll the Dice</div>
              <p className="text-muted-foreground">
                Click the dice to roll and see what number you get (1-6)
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-primary">2. Make Decisions</div>
              <p className="text-muted-foreground">
                Choose from three decision options based on your dice roll
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-primary">3. Level Up</div>
              <p className="text-muted-foreground">
                Earn points and level up by making good decisions quickly
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
