import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";

export interface GhostData {
  id: number;
  laneIndex: number;
  position: number;
}

interface GhostGameState {
  gamePhase: GamePhase;
  score: number;
  timeLeft: number;
  lanes: GhostData[][];
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

// Helper function to generate random ghosts for a lane
const generateGhostsForLane = (startId: number, count: number, laneIndex: number): GhostData[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    laneIndex,
    position: index
  }));
};

export const useGhostGame = create<GhostGameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "ready",
    score: 0,
    timeLeft: 30,
    lanes: [[], [], []], // Three empty lanes
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
      let currentId = nextGhostId;

      // Generate 10-15 ghosts per lane initially
      const lane0Count = Math.floor(Math.random() * 6) + 10;
      const lane1Count = Math.floor(Math.random() * 6) + 10;
      const lane2Count = Math.floor(Math.random() * 6) + 10;

      const lane0 = generateGhostsForLane(currentId, lane0Count, 0);
      currentId += lane0Count;

      const lane1 = generateGhostsForLane(currentId, lane1Count, 1);
      currentId += lane1Count;

      const lane2 = generateGhostsForLane(currentId, lane2Count, 2);
      currentId += lane2Count;

      set({
        lanes: [lane0, lane1, lane2],
        nextGhostId: currentId
      });
    },

    shootGhost: (laneIndex: number): boolean => {
      const { lanes, score, nextGhostId } = get();
      
      if (laneIndex < 0 || laneIndex >= 3) return false;
      
      const targetLane = lanes[laneIndex];
      
      // Check if there's a ghost to shoot
      if (targetLane.length === 0) return false;

      // Remove the first (closest) ghost
      const newLanes = [...lanes];
      newLanes[laneIndex] = targetLane.slice(1).map((ghost, index) => ({
        ...ghost,
        position: index
      }));

      // Add new ghosts randomly to keep the queues filled
      const shouldAddGhost = Math.random() < 0.7; // 70% chance to add a new ghost
      if (shouldAddGhost) {
        const randomLane = Math.floor(Math.random() * 3);
        const newGhost: GhostData = {
          id: nextGhostId,
          laneIndex: randomLane,
          position: newLanes[randomLane].length
        };
        newLanes[randomLane].push(newGhost);
        
        set({ nextGhostId: nextGhostId + 1 });
      }

      set({
        lanes: newLanes,
        score: score + 1
      });

      return true;
    }
  }))
);
