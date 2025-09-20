import { useEffect } from "react";
import { useGhostGame } from "../../lib/stores/useGhostGame";
import { useHighScore } from "../../lib/stores/useHighScore";

export default function GameOverScreen() {
  const { score, restartGame } = useGhostGame();
  const { highScore, isNewHighScore } = useHighScore();

  // Handle restart with R key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "KeyR") {
        restartGame();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [restartGame]);

  const handleRestart = () => {
    restartGame();
  };

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Game Over!</h1>
        
        <div className="mb-6">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            Final Score: {score}
          </div>
          
          {isNewHighScore ? (
            <div className="text-xl text-green-600 font-bold">
              🎉 New High Score! 🎉
            </div>
          ) : (
            <div className="text-lg text-gray-600">
              High Score: {highScore}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Play Again
          </button>
          
          <div className="text-sm text-gray-500">
            Press R to restart quickly
          </div>
        </div>
      </div>
    </div>
  );
}
