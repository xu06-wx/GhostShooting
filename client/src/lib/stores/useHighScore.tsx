import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useGhostGame } from "./useGhostGame";

interface HighScoreState {
  highScore: number;
  isNewHighScore: boolean;
  
  // Actions
  updateHighScore: (score: number) => void;
  loadHighScore: () => void;
}

const HIGH_SCORE_KEY = "ghost_shooter_high_score";

export const useHighScore = create<HighScoreState>()(
  subscribeWithSelector((set, get) => ({
    highScore: 0,
    isNewHighScore: false,

    updateHighScore: (score: number) => {
      const { highScore } = get();
      
      if (score > highScore) {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
        set({ 
          highScore: score,
          isNewHighScore: true
        });
      } else {
        set({ isNewHighScore: false });
      }
    },

    loadHighScore: () => {
      const savedScore = localStorage.getItem(HIGH_SCORE_KEY);
      const highScore = savedScore ? parseInt(savedScore, 10) : 0;
      set({ highScore, isNewHighScore: false });
    }
  }))
);

// Subscribe to game state changes to update high score
useGhostGame.subscribe(
  (state) => state.gamePhase,
  (gamePhase) => {
    if (gamePhase === "ended") {
      const score = useGhostGame.getState().score;
      useHighScore.getState().updateHighScore(score);
    }
  }
);

// Load high score on initialization
useHighScore.getState().loadHighScore();
