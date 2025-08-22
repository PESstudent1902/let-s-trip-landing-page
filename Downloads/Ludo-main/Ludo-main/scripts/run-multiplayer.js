// Script to run the full multiplayer server with Socket.IO
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

// CORS setup
app.use(cors());
app.use(express.json());

// Serve static files from dist/spa
app.use(express.static(join(__dirname, '../dist/spa')));

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Game state (in-memory)
let gameState = {
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

console.log('🎲 Starting Multiplayer Dice Game Server...');
console.log('🎯 Admin password: admin123');

// Basic Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.emit('gameState', gameState);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API Routes
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Catch all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/spa/index.html'));
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🎲 Multiplayer Dice Game server running on port ${PORT}`);
  console.log(`🌐 Open http://localhost:${PORT} to play!`);
});
