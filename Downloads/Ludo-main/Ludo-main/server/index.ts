import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { GameState, Player, gameScenarios, AnswerSubmission } from "../shared/gameData";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Game state (in-memory for now)
let gameState: GameState = {
  id: 'game-1',
  phase: 'lobby',
  currentScenario: null,
  diceResult: null,
  isRolling: false,
  questionStartTime: null,
  usedScenarios: [],
  players: {},
  adminId: null,
  settings: {
    adminPassword: 'admin123',
    maxPlayers: 50
  }
};

// Timer reference for auto-submitting answers
let questionTimer: NodeJS.Timeout | null = null;

// Helper functions
const generatePlayerId = () => Math.random().toString(36).substr(2, 9);

const broadcastGameState = () => {
  io.emit('gameState', gameState);
};

const broadcastToAdmin = (event: string, data: any) => {
  if (gameState.adminId) {
    io.to(gameState.adminId).emit(event, data);
  }
};

const getAvailableScenarios = () => {
  return Array.from({ length: 25 }, (_, i) => i + 1).filter(
    id => !gameState.usedScenarios.includes(id)
  );
};

const endQuestion = () => {
  if (questionTimer) {
    clearTimeout(questionTimer);
    questionTimer = null;
  }
  
  // Auto-submit empty answers for players who didn't submit
  Object.values(gameState.players).forEach(player => {
    if (!player.eliminated && gameState.currentScenario) {
      const hasSubmitted = player.answers.some(
        answer => answer.scenarioId === gameState.currentScenario
      );
      
      if (!hasSubmitted) {
        player.answers.push({
          scenarioId: gameState.currentScenario,
          justification: '[Time expired - no answer]',
          submittedAt: Date.now()
        });
      }
    }
  });
  
  gameState.phase = 'results';
  broadcastGameState();
  
  // Show results for 5 seconds, then go back to waiting
  setTimeout(() => {
    gameState.phase = 'waiting';
    broadcastGameState();
  }, 5000);
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Player joins game
  socket.on('joinGame', (data: { name: string; isAdmin?: boolean; adminPassword?: string }) => {
    const { name, isAdmin = false, adminPassword } = data;

    // Validate admin
    if (isAdmin) {
      if (adminPassword !== gameState.settings.adminPassword) {
        socket.emit('error', { message: 'Invalid admin password' });
        return;
      }
      if (gameState.adminId && gameState.adminId !== socket.id) {
        socket.emit('error', { message: 'Admin already exists' });
        return;
      }
      gameState.adminId = socket.id;
    }

    // Check if game is full
    const playerCount = Object.keys(gameState.players).length;
    if (!isAdmin && playerCount >= gameState.settings.maxPlayers) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }

    // Create player
    const player: Player = {
      id: socket.id,
      name,
      isAdmin,
      connected: true,
      answers: [],
      score: 0,
      eliminated: false
    };

    gameState.players[socket.id] = player;
    socket.emit('playerJoined', { playerId: socket.id, isAdmin });
    broadcastGameState();

    console.log(`${isAdmin ? 'Admin' : 'Player'} joined:`, name);
  });

  // Admin rolls dice
  socket.on('rollDice', (targetNumber: number) => {
    if (socket.id !== gameState.adminId) {
      socket.emit('error', { message: 'Only admin can roll dice' });
      return;
    }

    if (gameState.phase !== 'waiting') {
      socket.emit('error', { message: 'Cannot roll dice now' });
      return;
    }

    if (!targetNumber || targetNumber < 1 || targetNumber > 25) {
      socket.emit('error', { message: 'Invalid dice number' });
      return;
    }

    if (gameState.usedScenarios.includes(targetNumber)) {
      socket.emit('error', { message: 'Scenario already used' });
      return;
    }

    gameState.phase = 'rolling';
    gameState.isRolling = true;
    broadcastGameState();

    // Dice animation duration
    setTimeout(() => {
      gameState.diceResult = targetNumber;
      gameState.currentScenario = targetNumber;
      gameState.usedScenarios.push(targetNumber);
      gameState.isRolling = false;
      gameState.phase = 'question';
      gameState.questionStartTime = Date.now();

      broadcastGameState();

      // Start question timer
      questionTimer = setTimeout(endQuestion, 60000); // 60 seconds
    }, 3000); // 3 second dice animation
  });

  // Player submits answer
  socket.on('submitAnswer', (answer: AnswerSubmission) => {
    const player = gameState.players[socket.id];
    if (!player || player.eliminated) {
      socket.emit('error', { message: 'Player not found or eliminated' });
      return;
    }

    if (gameState.phase !== 'question' || !gameState.currentScenario) {
      socket.emit('error', { message: 'No active question' });
      return;
    }

    if (answer.scenarioId !== gameState.currentScenario) {
      socket.emit('error', { message: 'Invalid scenario ID' });
      return;
    }

    // Check if player already submitted
    const hasSubmitted = player.answers.some(
      a => a.scenarioId === answer.scenarioId
    );
    if (hasSubmitted) {
      socket.emit('error', { message: 'Answer already submitted' });
      return;
    }

    // Validate justification length
    if (!answer.justification || answer.justification.length > 60) {
      socket.emit('error', { message: 'Justification must be 1-60 characters' });
      return;
    }

    // Add answer
    player.answers.push({
      scenarioId: answer.scenarioId,
      selectedOption: answer.selectedOption,
      justification: answer.justification,
      submittedAt: Date.now()
    });

    // Update score (simple scoring for now)
    player.score += 10;

    socket.emit('answerSubmitted');
    broadcastToAdmin('playerAnswered', {
      playerId: socket.id,
      playerName: player.name,
      answer: answer
    });

    console.log(`Player ${player.name} submitted answer for scenario ${answer.scenarioId}`);
  });

  // Admin eliminates player
  socket.on('eliminatePlayer', (playerId: string) => {
    if (socket.id !== gameState.adminId) {
      socket.emit('error', { message: 'Only admin can eliminate players' });
      return;
    }

    const player = gameState.players[playerId];
    if (player && !player.isAdmin) {
      player.eliminated = true;
      io.to(playerId).emit('eliminated');
      broadcastGameState();
      console.log(`Player ${player.name} eliminated`);
    }
  });

  // Admin ends current question
  socket.on('endQuestion', () => {
    if (socket.id !== gameState.adminId) {
      socket.emit('error', { message: 'Only admin can end questions' });
      return;
    }

    if (gameState.phase === 'question') {
      endQuestion();
    }
  });

  // Admin resets game
  socket.on('resetGame', () => {
    if (socket.id !== gameState.adminId) {
      socket.emit('error', { message: 'Only admin can reset game' });
      return;
    }

    // Keep admin and clear everything else
    const adminPlayer = gameState.players[gameState.adminId];
    gameState = {
      ...gameState,
      phase: 'lobby',
      currentScenario: null,
      diceResult: null,
      isRolling: false,
      questionStartTime: null,
      usedScenarios: [],
      players: adminPlayer ? { [gameState.adminId]: adminPlayer } : {}
    };

    if (questionTimer) {
      clearTimeout(questionTimer);
      questionTimer = null;
    }

    broadcastGameState();
    console.log('Game reset by admin');
  });

  // Get available scenarios
  socket.on('getAvailableScenarios', () => {
    if (socket.id === gameState.adminId) {
      socket.emit('availableScenarios', getAvailableScenarios());
    }
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    const player = gameState.players[socket.id];
    if (player) {
      player.connected = false;
      
      // If admin disconnects, clear admin
      if (player.isAdmin) {
        gameState.adminId = null;
      }
      
      broadcastGameState();
      console.log(`Player ${player.name} disconnected`);
    }
  });
});

// API Routes
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.get("/api/demo", handleDemo);

app.get("/api/game-scenarios", (req, res) => {
  res.json(gameScenarios);
});

app.get("/api/game-state", (req, res) => {
  res.json(gameState);
});

// Export createServer for Vite development
export function createServer() {
  return app;
}

// Start server
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🎲 Monopoly Madness server running on port ${PORT}`);
  console.log(`🎯 Admin password: ${gameState.settings.adminPassword}`);
});

export { app, httpServer };
