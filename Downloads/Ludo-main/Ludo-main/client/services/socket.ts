import { io, Socket } from "socket.io-client";
import { GameState, AnswerSubmission } from "@shared/gameData";

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    if (this.socket) return;

    this.socket = io(window.location.origin, {
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("Connected to game server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from game server");
    });

    this.socket.on("error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
      this.emit("error", error);
    });

    this.socket.on("gameState", (gameState: GameState) => {
      this.emit("gameState", gameState);
    });

    this.socket.on(
      "playerJoined",
      (data: { playerId: string; isAdmin: boolean }) => {
        this.emit("playerJoined", data);
      },
    );

    this.socket.on("playerAnswered", (data: any) => {
      this.emit("playerAnswered", data);
    });

    this.socket.on("answerSubmitted", () => {
      this.emit("answerSubmitted");
    });

    this.socket.on("eliminated", () => {
      this.emit("eliminated");
    });

    this.socket.on("availableScenarios", (scenarios: number[]) => {
      this.emit("availableScenarios", scenarios);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  // Game actions
  joinGame(
    name: string,
    isAdmin = false,
    adminUsername?: string,
    adminPassword?: string,
    teamName?: string,
  ) {
    this.socket?.emit("joinGame", {
      name,
      isAdmin,
      adminUsername,
      adminPassword,
      teamName,
    });
  }

  rollDice(targetNumber: number) {
    this.socket?.emit("rollDice", targetNumber);
  }

  submitAnswer(answer: AnswerSubmission) {
    this.socket?.emit("submitAnswer", answer);
  }

  eliminatePlayer(playerId: string) {
    this.socket?.emit("eliminatePlayer", playerId);
  }

  endQuestion() {
    this.socket?.emit("endQuestion");
  }

  resetGame() {
    this.socket?.emit("resetGame");
  }

  getAvailableScenarios() {
    this.socket?.emit("getAvailableScenarios");
  }

  startGame() {
    this.socket?.emit("startGame");
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
