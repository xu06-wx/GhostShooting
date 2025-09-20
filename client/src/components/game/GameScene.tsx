import { useRef, useEffect } from "react";
import { useGhostGame } from "../../lib/stores/useGhostGame";
import { useAudio } from "../../lib/stores/useAudio";
import Ghost from "./Ghost";

export default function GameScene() {
  const { 
    ghostQueue, 
    shootGhost, 
    gamePhase, 
    timeLeft,
    endGame 
  } = useGhostGame();
  const { playHit, playSuccess } = useAudio();
  
  const lastShotTime = useRef(0);
  const shotCooldown = 200; // 200ms cooldown between shots

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gamePhase !== "playing") return;

      const currentTime = Date.now();
      
      // Check if enough time has passed since last shot
      if (currentTime - lastShotTime.current < shotCooldown) return;

      let shotFired = false;
      let laneIndex = -1;

      switch (event.code) {
        case "ArrowLeft":
          laneIndex = 0;
          shotFired = true;
          break;
        case "ArrowDown":
          laneIndex = 1;
          shotFired = true;
          break;
        case "ArrowRight":
          laneIndex = 2;
          shotFired = true;
          break;
      }

      if (shotFired) {
        event.preventDefault();
        lastShotTime.current = currentTime;
        const hit = shootGhost(laneIndex);
        
        if (hit) {
          playSuccess();
          console.log(`擊中跑道 ${laneIndex} 的鬼！`);
        } else {
          playHit();
          console.log(`跑道 ${laneIndex} 沒有擊中`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gamePhase, shootGhost, playHit, playSuccess]);

  // End game when timer reaches 0
  useEffect(() => {
    if (timeLeft <= 0 && gamePhase === "playing") {
      endGame();
    }
  }, [timeLeft, gamePhase, endGame]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Game field */}
      <div style={{
        width: '900px',
        height: '600px',
        backgroundColor: '#1a1a1a',
        border: '4px solid #444444',
        position: 'relative',
        display: 'flex'
      }}>
        {/* Lane dividers */}
        <div style={{
          position: 'absolute',
          left: '33.33%',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: '#666666'
        }} />
        <div style={{
          position: 'absolute',
          left: '66.66%',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: '#666666'
        }} />

        {/* Player position indicator */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '40px',
          backgroundColor: '#00ff00',
          borderRadius: '4px',
          border: '2px solid #00cc00'
        }} />

        {/* Render ghosts directly in their positions */}
        {ghostQueue
          .filter(ghost => ghost.row >= 0 && ghost.row < 15) // only show visible ghosts
          .sort((a, b) => a.row - b.row) // sort by row (closest first)
          .map((ghost) => {
            const laneWidth = 300; // 900px / 3 lanes
            const laneCenter = laneWidth * ghost.laneIndex + laneWidth / 2;
            const rowPosition = 100 + (ghost.row * 40); // start from top, each row 40px apart
            
            return (
              <div
                key={ghost.id}
                style={{
                  position: 'absolute',
                  left: `${laneCenter - 25}px`, // center the 50px ghost
                  top: `${rowPosition}px`,
                  zIndex: 100 - ghost.row // closer ghosts on top
                }}
              >
                <Ghost
                  ghost={ghost}
                  isClosest={ghost.row === 0}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
