import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";

export interface GhostData {
  id: number;
  laneIndex: number; // 0=left, 1=middle, 2=right
  row: number; // distance from player (0 is closest)
}

interface GhostGameState {
  gamePhase: GamePhase;
  score: number;
  timeLeft: number;
  ghostQueue: GhostData[]; // single queue of ghosts, each in different rows
  nextGhostId: number;
  gameTimer: NodeJS.Timeout | null;

  // Actions
  startGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  shootGhost: (laneIndex: number) => boolean;
  updateTimer: () => void;
  generateGhosts: () => void;
}

// Helper function to generate random ghost queue - each row has exactly one ghost
const generateGhostQueue = (startId: number, count: number): GhostData[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    laneIndex: Math.floor(Math.random() * 3), // randomly choose lane 0, 1, or 2
    row: index // position in queue (0 is closest to player)
  }));
};

export const useGhostGame = create<GhostGameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "ready",
    score: 0,
    timeLeft: 30,
    ghostQueue: [], // Empty ghost queue
    nextGhostId: 1,
    gameTimer: null,

    startGame: () => {
      const { generateGhosts, updateTimer } = get();
      
      // Clear any existing timer
      const existingTimer = get().gameTimer;
      if (existingTimer) {
        clearInterval(existingTimer);
      }

      // Initialize game state
      set({
        gamePhase: "playing",
        score: 0,
        timeLeft: 30,
        nextGhostId: 1
      });

      // Generate initial ghosts
      generateGhosts();

      // Start the game timer
      const timer = setInterval(() => {
        updateTimer();
      }, 1000);

      set({ gameTimer: timer });
    },

    endGame: () => {
      const timer = get().gameTimer;
      if (timer) {
        clearInterval(timer);
      }
      
      set({ 
        gamePhase: "ended",
        gameTimer: null
      });
    },

    restartGame: () => {
      const { startGame } = get();
      startGame();
    },

    updateTimer: () => {
      const { timeLeft, endGame } = get();
      const newTimeLeft = timeLeft - 1;
      
      if (newTimeLeft <= 0) {
        endGame();
      } else {
        set({ timeLeft: newTimeLeft });
      }
    },

    generateGhosts: () => {
      const { nextGhostId } = get();
      
      // Generate 20-25 ghosts in queue initially
      const ghostCount = Math.floor(Math.random() * 6) + 20;
      const newQueue = generateGhostQueue(nextGhostId, ghostCount);

      set({
        ghostQueue: newQueue,
        nextGhostId: nextGhostId + ghostCount
      });
    },

    shootGhost: (laneIndex: number): boolean => {
      const { ghostQueue, score, nextGhostId } = get();
      
      if (laneIndex < 0 || laneIndex >= 3) return false;
      
      // Find the closest ghost (row 0) and check if it's in the correct lane
      const closestGhost = ghostQueue.find(ghost => ghost.row === 0);
      
      // If no ghost at row 0, or ghost is not in the target lane, miss
      if (!closestGhost || closestGhost.laneIndex !== laneIndex) {
        return false;
      }
      
      // Remove the shot ghost and move all other ghosts forward
      const newQueue = ghostQueue
        .filter(ghost => ghost.id !== closestGhost.id)
        .map(ghost => ({
          ...ghost,
          row: ghost.row - 1 // move all ghosts one row closer to player
        }));
      
      // Add a new ghost at the back of the queue (always add to maintain infinite ghosts)
      const maxRow = newQueue.length > 0 ? Math.max(...newQueue.map(g => g.row)) : -1;
      const newGhost: GhostData = {
        id: nextGhostId,
        laneIndex: Math.floor(Math.random() * 3), // random lane
        row: maxRow + 1
      };
      newQueue.push(newGhost);

      set({
        ghostQueue: newQueue,
        score: score + 1,
        nextGhostId: nextGhostId + 1
      });

      return true;
    }
  }))
);
