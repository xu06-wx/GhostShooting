import { useGhostGame } from "../../lib/stores/useGhostGame";
import { useHighScore } from "../../lib/stores/useHighScore";

export default function GameUI() {
  const { score, timeLeft, gamePhase } = useGhostGame();
  const { highScore } = useHighScore();

  if (gamePhase === "ended") return null;

  return (
    <div className="absolute top-0 left-0 w-full p-6 z-10">
      <div className="flex justify-between items-start">
        {/* Score and High Score */}
        <div className="bg-black/80 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">Score: {score}</div>
          <div className="text-lg text-gray-300">High Score: {highScore}</div>
        </div>

        {/* Timer */}
        <div className="bg-black/80 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">
            Time: {timeLeft}s
          </div>
        </div>
      </div>

      {/* Controls instruction */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white p-4 rounded-lg text-center">
        <div className="text-lg font-bold mb-2">Controls</div>
        <div className="text-sm">
          <div>← Left Lane</div>
          <div>↓ Middle Lane</div>
          <div>→ Right Lane</div>
        </div>
      </div>
    </div>
  );
}
