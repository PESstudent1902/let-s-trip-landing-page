import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GameScenario, AnswerSubmission } from '@shared/gameData';
import { Clock, CheckCircle2, Send, AlertCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamTaskViewProps {
  scenario: GameScenario;
  timeLeft: number;
  onSubmitAnswer: (answer: AnswerSubmission) => void;
  hasSubmitted: boolean;
  isSubmitting: boolean;
  teamName: string;
  playerName: string;
  diceResult: number;
}

export default function TeamTaskView({
  scenario,
  timeLeft,
  onSubmitAnswer,
  hasSubmitted,
  isSubmitting,
  teamName,
  playerName,
  diceResult
}: TeamTaskViewProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);

  useEffect(() => {
    setCharCount(justification.length);
  }, [justification]);

  const handleSubmit = () => {
    if (hasSubmitted || isSubmitting) return;

    // Validate inputs
    if (scenario.type === 'mcq' && !selectedOption) {
      return;
    }

    if (!justification.trim()) {
      return;
    }

    if (justification.length > 60) {
      return;
    }

    const answer: AnswerSubmission = {
      scenarioId: scenario.id,
      selectedOption: scenario.type === 'mcq' ? selectedOption : undefined,
      justification: justification.trim()
    };

    onSubmitAnswer(answer);
  };

  const isTimeRunningOut = timeLeft <= 10;
  const canSubmit = justification.trim() && 
                   justification.length <= 60 && 
                   (scenario.type === 'short' || selectedOption) &&
                   !hasSubmitted &&
                   !isSubmitting;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Team Info */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold text-foreground">Team: {teamName}</div>
                <div className="text-sm text-muted-foreground">Player: {playerName}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Dice Rolled</div>
              <div className="text-2xl font-bold text-primary">{diceResult}</div>
              <div className="text-xs text-muted-foreground">Scenario #{scenario.id}</div>
            </div>
          </div>
        </Card>

        {/* Timer */}
        <Card className={cn(
          "p-4 text-center transition-all duration-300",
          isTimeRunningOut && "border-red-500 bg-red-500/10"
        )}>
          <div className="flex items-center justify-center space-x-4">
            <Clock className={cn(
              "w-6 h-6",
              isTimeRunningOut ? "text-red-400" : "text-primary"
            )} />
            <div className="text-3xl font-bold">
              <span className={cn(
                "tabular-nums",
                isTimeRunningOut ? "text-red-400 animate-pulse" : "text-foreground"
              )}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Time Remaining
            </div>
          </div>
          {isTimeRunningOut && (
            <div className="text-sm text-red-400 mt-2 animate-bounce">
              ⚠️ Time is running out! Submit your answer now!
            </div>
          )}
        </Card>

        {/* Task Content */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-primary">
                Challenge #{scenario.id}
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {scenario.title}
              </h1>
            </div>

            {/* Scenario Description */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Scenario:</h3>
                <p className="text-muted-foreground bg-muted p-4 rounded-lg">
                  {scenario.scenario}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Your Team's Task:</h3>
                <p className="text-foreground font-medium bg-primary/10 p-4 rounded-lg border border-primary/20">
                  {scenario.task}
                </p>
              </div>
            </div>

            {/* Answer Section */}
            <div className="space-y-4">
              {scenario.type === 'mcq' && scenario.options && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Choose your team's answer:</Label>
                  <RadioGroup
                    value={selectedOption}
                    onValueChange={setSelectedOption}
                    disabled={hasSubmitted}
                    className="space-y-3"
                  >
                    {scenario.options.map((option, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem 
                          value={option} 
                          id={`option-${index}`}
                          className="mt-1"
                        />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="text-sm leading-relaxed cursor-pointer flex-1"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Team Reasoning */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    {scenario.type === 'mcq' ? 'Team reasoning (required):' : 'Team answer:'}
                  </Label>
                  <div className={cn(
                    "text-xs",
                    charCount > 60 ? "text-red-400" : 
                    charCount > 50 ? "text-yellow-400" : "text-muted-foreground"
                  )}>
                    {charCount}/60
                  </div>
                </div>
                
                <Input
                  placeholder={scenario.type === 'mcq' 
                    ? "Explain your team's choice in 60 characters or less..." 
                    : "Your team's answer in 60 characters or less..."
                  }
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  disabled={hasSubmitted}
                  maxLength={60}
                  className={cn(
                    charCount > 60 && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                
                {charCount > 60 && (
                  <div className="text-xs text-red-400 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Answer must be 60 characters or less</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                {hasSubmitted ? (
                  <div className="flex items-center justify-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Team Answer Submitted!</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    size="lg"
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Submit Team Answer</span>
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Team Tips */}
        {!hasSubmitted && (
          <Card className="p-4">
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <div className="font-medium text-foreground">Team Strategy Tips:</div>
              <div>• Discuss the scenario with your team members</div>
              <div>• Consider all options before selecting</div>
              <div>• Make your reasoning clear and concise</div>
              <div>• Submit before the timer runs out!</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
