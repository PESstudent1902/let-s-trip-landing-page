import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Sparkles, Dices } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary rounded-xl">
              <Dices className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground">
              Looks like you rolled a bad dice! This page doesn't exist.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Back to Game</span>
            </Link>
          </Button>
          
          <div className="text-xs text-muted-foreground flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>Let's get back to making decisions!</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
