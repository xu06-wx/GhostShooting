import { useEffect, useState } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { useGhostGame } from "./lib/stores/useGhostGame";
import GameScene from "./components/game/GameScene";
import GameUI from "./components/game/GameUI";
import GameOverScreen from "./components/game/GameOverScreen";
import "@fontsource/inter";

function App() {
  const { gamePhase, startGame } = useGhostGame();
  const { setHitSound, setSuccessSound } = useAudio();

  // Initialize audio
  useEffect(() => {
    const hitAudio = new Audio("/sounds/hit.mp3");
    const successAudio = new Audio("/sounds/success.mp3");
    
    setHitSound(hitAudio);
    setSuccessSound(successAudio);
  }, [setHitSound, setSuccessSound]);

  // Auto-start the game when the app loads
  useEffect(() => {
    if (gamePhase === "ready") {
      startGame();
    }
  }, [gamePhase, startGame]);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      backgroundColor: '#0a0a0a',
      fontFamily: 'Inter, sans-serif'
    }}>
      {gamePhase === "ended" && <GameOverScreen />}
      <GameScene />
      <GameUI />
    </div>
  );
}

export default App;
