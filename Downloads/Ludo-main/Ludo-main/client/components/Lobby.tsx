import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Gamepad2, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LobbyProps {
  onJoinGame: (name: string, isAdmin?: boolean, adminPassword?: string) => void;
  isConnecting: boolean;
  error: string | null;
}

export default function Lobby({ onJoinGame, isConnecting, error }: LobbyProps) {
  const [playerName, setPlayerName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState("player");

  const handleJoinAsPlayer = () => {
    if (playerName.trim()) {
      onJoinGame(playerName.trim(), false);
    }
  };

  const handleJoinAsAdmin = () => {
    if (playerName.trim() && adminPassword.trim()) {
      onJoinGame(playerName.trim(), true, adminPassword.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary rounded-xl">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Monopoly Madness
            </h1>
            <p className="text-muted-foreground">Roll • Buy • Dominate</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-4 border-red-500 bg-red-500/10">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </Card>
        )}

        {/* Join Form */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="player"
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Player</span>
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="player" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="player-name">Your Name</Label>
                <Input
                  id="player-name"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleJoinAsPlayer()}
                  maxLength={20}
                />
              </div>

              <Button
                onClick={handleJoinAsPlayer}
                disabled={!playerName.trim() || isConnecting}
                className="w-full"
                size="lg"
              >
                {isConnecting ? "Joining..." : "Join Game"}
              </Button>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>• Wait for admin to roll dice</p>
                <p>• Answer questions within 60 seconds</p>
                <p>• Compete for the highest score</p>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Admin Name</Label>
                  <Input
                    id="admin-name"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={20}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleJoinAsAdmin()}
                  />
                </div>
              </div>

              <Button
                onClick={handleJoinAsAdmin}
                disabled={
                  !playerName.trim() || !adminPassword.trim() || isConnecting
                }
                className="w-full"
                size="lg"
                variant="outline"
              >
                <Crown className="w-4 h-4 mr-2" />
                {isConnecting ? "Joining..." : "Join as Admin"}
              </Button>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>• Control dice rolls (1-25)</p>
                <p>• Monitor player answers in real-time</p>
                <p>• Eliminate underperforming players</p>
                <p>• Manage game flow and timing</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Game Info */}
        <Card className="p-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-foreground">Game Features</h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="space-y-1">
                <div className="font-medium text-primary">25 Scenarios</div>
                <div>Unique challenges for each dice roll</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-primary">60s Timer</div>
                <div>Quick thinking required</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-primary">Real-time</div>
                <div>Live multiplayer experience</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-primary">Competitive</div>
                <div>Score-based elimination</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
