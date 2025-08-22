import { createServer as createHttpServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  GameState,
  Player,
  gameScenarios,
  AnswerSubmission,
} from "../shared/gameData";

// Express app with Socket.IO for development
const app = express();
const httpServer = createHttpServer(app);

// Only initialize Socket.IO if we're in development mode
let io: Server | null = null;

// Game state (in-memory)
let gameState: GameState = {
  id: "game-1",
  phase: "waiting",
  currentScenario: null,
  diceResult: null,
  isRolling: false,
  questionStartTime: null,
  usedScenarios: [],
  players: {},
  adminId: null,
  settings: {
    adminUsername: "MM_access",
    adminPassword: "PES_ludo@123",
    maxPlayers: 50,
  },
};

let questionTimer: NodeJS.Timeout | null = null;

// Helper functions
const broadcastGameState = () => {
  if (io) io.emit("gameState", gameState);
};

const broadcastToAdmin = (event: string, data: any) => {
  if (gameState.adminId && io) {
    io.to(gameState.adminId).emit(event, data);
  }
};

const getAvailableScenarios = () => {
  return Array.from({ length: 25 }, (_, i) => i + 1).filter(
    (id) => !gameState.usedScenarios.includes(id),
  );
};

const endQuestion = () => {
  if (questionTimer) {
    clearTimeout(questionTimer);
    questionTimer = null;
  }

  Object.values(gameState.players).forEach((player) => {
    if (!player.eliminated && gameState.currentScenario) {
      const hasSubmitted = player.answers.some(
        (answer) => answer.scenarioId === gameState.currentScenario,
      );

      if (!hasSubmitted) {
        player.answers.push({
          scenarioId: gameState.currentScenario,
          justification: "[Time expired - no answer]",
          submittedAt: Date.now(),
        });
      }
    }
  });

  gameState.phase = "results";
  broadcastGameState();

  setTimeout(() => {
    gameState.phase = "waiting";
    broadcastGameState();
  }, 5000);
};

// Initialize Socket.IO for development
const initializeSocketIO = () => {
  if (io) return;

  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🎮 Player connected:", socket.id);

    socket.on(
      "joinGame",
      (data: { name: string; isAdmin?: boolean; adminUsername?: string; adminPassword?: string; teamName?: string }) => {
        const { name, isAdmin = false, adminUsername, adminPassword, teamName } = data;

        if (isAdmin) {
        if (adminUsername !== gameState.settings.adminUsername || adminPassword !== gameState.settings.adminPassword) {
          socket.emit("error", { message: "Invalid admin credentials" });
          return;
        }
        // Always allow new admin (override existing one for direct access)
        gameState.adminId = socket.id;
      }

        const playerCount = Object.keys(gameState.players).length;
        if (!isAdmin && playerCount >= gameState.settings.maxPlayers) {
          socket.emit("error", { message: "Game is full" });
          return;
        }

        const player: Player = {
        id: socket.id,
        name,
        teamName: teamName,
        isAdmin,
        connected: true,
        answers: [],
        score: 0,
        eliminated: false,
      };

        gameState.players[socket.id] = player;
        socket.emit("playerJoined", { playerId: socket.id, isAdmin });
        broadcastGameState();

        console.log(`✅ ${isAdmin ? "Admin" : "Player"} joined: ${name}`);
      },
    );

    socket.on("rollDice", (targetNumber: number) => {
      if (socket.id !== gameState.adminId) {
        socket.emit("error", { message: "Only admin can roll dice" });
        return;
      }

      if (gameState.phase !== "waiting") {
        socket.emit("error", { message: "Cannot roll dice now" });
        return;
      }

      if (!targetNumber || targetNumber < 1 || targetNumber > 25) {
        socket.emit("error", { message: "Invalid dice number" });
        return;
      }

      if (gameState.usedScenarios.includes(targetNumber)) {
        socket.emit("error", { message: "Scenario already used" });
        return;
      }

      gameState.phase = "rolling";
      gameState.isRolling = true;
      broadcastGameState();

      setTimeout(() => {
        // Dice shows 1-6 but scenario is what admin selected
        const diceValue = Math.floor(Math.random() * 6) + 1;
        gameState.diceResult = diceValue;
        gameState.currentScenario = targetNumber; // Admin's selected scenario
        gameState.usedScenarios.push(targetNumber);
        gameState.isRolling = false;
        gameState.phase = "question";
        gameState.questionStartTime = Date.now();

        broadcastGameState();
        questionTimer = setTimeout(endQuestion, 60000);
        console.log(`🎲 Dice rolled: ${diceValue}, Scenario: ${targetNumber}`);
      }, 3000);
    });

    socket.on("submitAnswer", (answer: AnswerSubmission) => {
      const player = gameState.players[socket.id];
      if (!player || player.eliminated) {
        socket.emit("error", { message: "Player not found or eliminated" });
        return;
      }

      if (gameState.phase !== "question" || !gameState.currentScenario) {
        socket.emit("error", { message: "No active question" });
        return;
      }

      if (answer.scenarioId !== gameState.currentScenario) {
        socket.emit("error", { message: "Invalid scenario ID" });
        return;
      }

      const hasSubmitted = player.answers.some(
        (a) => a.scenarioId === answer.scenarioId,
      );
      if (hasSubmitted) {
        socket.emit("error", { message: "Answer already submitted" });
        return;
      }

      if (!answer.justification || answer.justification.length > 60) {
        socket.emit("error", {
          message: "Justification must be 1-60 characters",
        });
        return;
      }

      player.answers.push({
        scenarioId: answer.scenarioId,
        selectedOption: answer.selectedOption,
        justification: answer.justification,
        submittedAt: Date.now(),
      });

      player.score += 10;
      socket.emit("answerSubmitted");
      broadcastToAdmin("playerAnswered", {
        playerId: socket.id,
        playerName: player.name,
        answer: answer,
      });
    });

    socket.on("eliminatePlayer", (playerId: string) => {
      if (socket.id !== gameState.adminId) {
        socket.emit("error", { message: "Only admin can eliminate players" });
        return;
      }

      const player = gameState.players[playerId];
      if (player && !player.isAdmin) {
        player.eliminated = true;
        io?.to(playerId).emit("eliminated");
        broadcastGameState();
      }
    });

    socket.on("endQuestion", () => {
      if (socket.id !== gameState.adminId) {
        socket.emit("error", { message: "Only admin can end questions" });
        return;
      }

      if (gameState.phase === "question") {
        endQuestion();
      }
    });

    socket.on("resetGame", () => {
      if (socket.id !== gameState.adminId) {
        socket.emit("error", { message: "Only admin can reset game" });
        return;
      }

      const adminPlayer = gameState.players[gameState.adminId];
      gameState = {
        ...gameState,
        phase: "waiting",
        currentScenario: null,
        diceResult: null,
        isRolling: false,
        questionStartTime: null,
        usedScenarios: [],
        players: adminPlayer ? { [gameState.adminId]: adminPlayer } : {},
      };

      if (questionTimer) {
        clearTimeout(questionTimer);
        questionTimer = null;
      }

      broadcastGameState();
    });

    socket.on("getAvailableScenarios", () => {
      if (socket.id === gameState.adminId) {
        socket.emit("availableScenarios", getAvailableScenarios());
      }
    });

    socket.on("startGame", () => {
      if (socket.id !== gameState.adminId) {
        socket.emit("error", { message: "Only admin can start the game" });
        return;
      }

      if (gameState.phase !== "lobby") {
        socket.emit("error", { message: "Game already started" });
        return;
      }

      gameState.phase = "waiting";
      broadcastGameState();
      console.log("🎮 Game started by admin");
    });

    socket.on("disconnect", () => {
      const player = gameState.players[socket.id];
      if (player) {
        player.connected = false;

        if (player.isAdmin) {
          gameState.adminId = null;
        }

        broadcastGameState();
        console.log(`❌ Player ${player.name} disconnected`);
      }
    });
  });

  console.log("🚀 Socket.IO initialized for development");
};

app.use(cors());
app.use(express.json());

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

export function createServer() {
  // Initialize Socket.IO when server is created
  initializeSocketIO();
  return app;
}

export { httpServer };
