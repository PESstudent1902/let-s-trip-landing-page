import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, LogIn, UserPlus, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamAuthProps {
  onTeamLogin: (teamName: string, playerName: string) => void;
  onAdminLogin: (username: string, password: string) => void;
  isConnecting: boolean;
  error: string | null;
}

export default function TeamAuth({
  onTeamLogin,
  onAdminLogin,
  isConnecting,
  error
}: TeamAuthProps) {
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleTeamSubmit = (isSignup: boolean) => {
    if (teamName.trim() && playerName.trim()) {
      onTeamLogin(teamName.trim(), playerName.trim());
    }
  };

  const handleAdminAccess = () => {
    setShowAdminPrompt(true);
  };

  const handleAdminSubmit = () => {
    if (adminUsername.trim() && adminPassword.trim()) {
      onAdminLogin(adminUsername.trim(), adminPassword.trim());
    }
  };

  const handleCancelAdmin = () => {
    setShowAdminPrompt(false);
    setAdminUsername('');
    setAdminPassword('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Admin Access - Top Right Style */}
        <div className="flex justify-end">
          {!showAdminPrompt ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdminAccess}
              disabled={isConnecting}
              className="flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Access</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-28"
                size="sm"
              />
              <Input
                type="password"
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminSubmit()}
                className="w-28"
                size="sm"
              />
              <Button
                size="sm"
                onClick={handleAdminSubmit}
                disabled={!adminUsername.trim() || !adminPassword.trim() || isConnecting}
              >
                Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelAdmin}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary rounded-xl">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Monopoly Madness
            </h1>
            <p className="text-muted-foreground">Team Challenge Arena</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-4 border-red-500 bg-red-500/10">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </Card>
        )}

        {/* Team Login/Signup Form */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Team Login</span>
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Create Team</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-team">Team Name</Label>
                  <Input
                    id="login-team"
                    placeholder="Enter your team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    maxLength={30}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-player">Your Name</Label>
                  <Input
                    id="login-player"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTeamSubmit(false)}
                    maxLength={20}
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => handleTeamSubmit(false)}
                disabled={!teamName.trim() || !playerName.trim() || isConnecting}
                className="w-full"
                size="lg"
              >
                {isConnecting ? 'Joining Team...' : 'Join Team'}
              </Button>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>• Wait for scenarios to be revealed</p>
                <p>�� Work together with your team</p>
                <p>• Answer within the time limit</p>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-team">New Team Name</Label>
                  <Input
                    id="signup-team"
                    placeholder="Create a team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    maxLength={30}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-player">Your Name</Label>
                  <Input
                    id="signup-player"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTeamSubmit(true)}
                    maxLength={20}
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => handleTeamSubmit(true)}
                disabled={!teamName.trim() || !playerName.trim() || isConnecting}
                className="w-full"
                size="lg"
                variant="outline"
              >
                {isConnecting ? 'Creating Team...' : 'Create & Join Team'}
              </Button>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>• Create a new team for your group</p>
                <p>• Invite teammates to join with team name</p>
                <p>• Collaborate on challenges together</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Game Info */}
        <Card className="p-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-foreground">How Teams Play</h3>
            <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span>Teams see scenarios when admin rolls dice</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span>1 minute timer for each challenge</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span>Work together to submit best answer</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span>Compete against other teams for points</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
