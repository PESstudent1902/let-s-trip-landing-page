import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Decision {
  id: string;
  text: string;
  type: 'good' | 'bad' | 'neutral';
  points: number;
}

interface DecisionMakerProps {
  diceValue: number;
  onDecisionMade: (decision: Decision, points: number) => void;
  isVisible: boolean;
}

const decisions: Record<number, Decision[]> = {
  1: [
    { id: '1-1', text: 'Take a safe path forward', type: 'neutral', points: 5 },
    { id: '1-2', text: 'Rest and recover energy', type: 'good', points: 10 },
    { id: '1-3', text: 'Rush ahead carelessly', type: 'bad', points: -5 }
  ],
  2: [
    { id: '2-1', text: 'Split the team', type: 'neutral', points: 8 },
    { id: '2-2', text: 'Share resources equally', type: 'good', points: 15 },
    { id: '2-3', text: 'Keep everything for yourself', type: 'bad', points: -10 }
  ],
  3: [
    { id: '3-1', text: 'Try a moderate approach', type: 'neutral', points: 12 },
    { id: '3-2', text: 'Help others in need', type: 'good', points: 20 },
    { id: '3-3', text: 'Ignore team requests', type: 'bad', points: -8 }
  ],
  4: [
    { id: '4-1', text: 'Make a balanced decision', type: 'neutral', points: 15 },
    { id: '4-2', text: 'Lead by example', type: 'good', points: 25 },
    { id: '4-3', text: 'Create unnecessary conflict', type: 'bad', points: -15 }
  ],
  5: [
    { id: '5-1', text: 'Stay with the group', type: 'neutral', points: 20 },
    { id: '5-2', text: 'Sacrifice for team success', type: 'good', points: 30 },
    { id: '5-3', text: 'Abandon the mission', type: 'bad', points: -20 }
  ],
  6: [
    { id: '6-1', text: 'Take calculated risks', type: 'neutral', points: 25 },
    { id: '6-2', text: 'Achieve perfect harmony', type: 'good', points: 35 },
    { id: '6-3', text: 'Destroy team morale', type: 'bad', points: -25 }
  ]
};

const typeIcons = {
  good: CheckCircle,
  bad: XCircle,
  neutral: AlertCircle
};

const typeColors = {
  good: 'text-green-400 border-green-400/50 bg-green-400/10 hover:bg-green-400/20',
  bad: 'text-red-400 border-red-400/50 bg-red-400/10 hover:bg-red-400/20',
  neutral: 'text-blue-400 border-blue-400/50 bg-blue-400/10 hover:bg-blue-400/20'
};

export default function DecisionMaker({ 
  diceValue, 
  onDecisionMade, 
  isVisible 
}: DecisionMakerProps) {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);

  const currentDecisions = decisions[diceValue] || [];

  useEffect(() => {
    if (isVisible) {
      setSelectedDecision(null);
      setTimeLeft(10);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-select neutral option if time runs out
            const neutralOption = currentDecisions.find(d => d.type === 'neutral');
            if (neutralOption) {
              handleDecision(neutralOption);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible, diceValue]);

  const handleDecision = (decision: Decision) => {
    setSelectedDecision(decision);
    setTimeout(() => {
      onDecisionMade(decision, decision.points);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Make Your Decision
          </h3>
          <p className="text-muted-foreground">
            You rolled a {diceValue}! Choose wisely...
          </p>
          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-2">Time Remaining</div>
            <div className={cn(
              'text-3xl font-bold transition-colors duration-300',
              timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-primary'
            )}>
              {timeLeft}s
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {currentDecisions.map((decision) => {
            const Icon = typeIcons[decision.type];
            const isSelected = selectedDecision?.id === decision.id;
            
            return (
              <Button
                key={decision.id}
                variant="outline"
                onClick={() => handleDecision(decision)}
                disabled={!!selectedDecision}
                className={cn(
                  'h-auto p-4 text-left justify-start transition-all duration-300',
                  typeColors[decision.type],
                  isSelected && 'ring-2 ring-primary scale-105',
                  !selectedDecision && 'hover:scale-102'
                )}
              >
                <div className="flex items-center space-x-4 w-full">
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-base">
                      {decision.text}
                    </div>
                    <div className="text-sm opacity-75 mt-1">
                      {decision.points > 0 ? '+' : ''}{decision.points} points
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <div className="flex justify-center space-x-6">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Good Choice</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span>Neutral Choice</span>
            </div>
            <div className="flex items-center space-x-1">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Bad Choice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
