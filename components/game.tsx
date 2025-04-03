"use client"

import { useEffect } from "react"
import Character from "./character"
import WasteItem from "./waste-item"
import ScoreBoard from "./score-board"
import GameSummary from "./game-summary"
import { useGameState } from "@/hooks/useGameState"
import { useGameLoop } from "@/hooks/useGameLoop"
import { useGameControls } from "@/hooks/useGameControls"
import type { GameConfig } from "@/types/game-types"

export default function Game() {
  // Game configuration - adjusted for the new pixel art layout
  const gameConfig: GameConfig = {
    startPosition: { x: 250, y: 330 }, // Adjusted position
    bins: [
      { type: "paper", x: 510, y: 340, width: 80, height: 80, number: 1 },
      { type: "glass", x: 510, y: 460, width: 80, height: 80, number: 2 },
      { type: "food", x: 510, y: 520, width: 80, height: 80, number: 3 },
      { type: "general", x: 510, y: 700, width: 80, height: 80, number: 4 },
    ],
    conveyorBelts: [{ id: 1, x: 150, y: 450, width: 300, direction: "right", speed: 1.5 }],
    initialBeltSpeed: 1.5,
    gameTime: 60,
  }

  // Game state
  const gameState = useGameState(gameConfig)

  // Game controls
  const { handleNumberKey } = useGameControls({
    gameStarted: gameState.gameStarted,
    isMoving: gameState.isMoving,
    bins: gameState.config.bins,
    currentItem: gameState.currentItem,
    sortItemToBin: gameState.sortItemToBin,
    debugLog: gameState.debugLog,
  })

  // Game loop
  useGameLoop({
    gameStarted: gameState.gameStarted,
    isMoving: gameState.isMoving,
    currentItem: gameState.currentItem,
    setCurrentItem: gameState.setCurrentItem,
    beltSpeed: gameState.beltSpeed,
    conveyorBelts: gameState.config.conveyorBelts,
    generateWasteItem: gameState.generateWasteItem,
    showPenalty: gameState.showPenalty,
    addToSortingHistory: gameState.addToSortingHistory,
    gameLoopRef: gameState.gameLoopRef,
    speedIncreaseIntervalRef: gameState.speedIncreaseIntervalRef,
    endGame: gameState.endGame,
  })

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (gameState.animationTimeoutRef.current) {
        clearTimeout(gameState.animationTimeoutRef.current)
        gameState.animationTimeoutRef.current = null
      }
    }
  }, [gameState.animationTimeoutRef])

  return (
    <div className="relative w-full max-w-4xl h-[800px] rounded-lg shadow-lg overflow-hidden">
      {/* Pixel art restaurant background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/pixel-restaurant.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated", // Keep the pixel art crisp
          zIndex: 10
        }}
      />

      {/* Red flash overlay */}
      {gameState.showRedFlash && (
        <div className="absolute inset-0 bg-red-500/40 z-50 animate-pulse pointer-events-none" />
      )}

      {/* Fine amount display */}
      {gameState.showFineAmount !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="text-4xl font-bold text-red-600 bg-white/80 px-6 py-4 rounded-lg animate-bounce shadow-lg">
            -£{gameState.showFineAmount.toFixed(2)}
          </div>
        </div>
      )}

      {!gameState.gameStarted && !gameState.gameEnded ? (
        // Start screen
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <div className="bg-yellow-100 p-8 rounded-lg border-4 border-yellow-500 shadow-lg max-w-md">
            <h2 className="text-3xl font-bold text-green-800 mb-4 text-center font-serif">Eco Sorter</h2>
            <button
              onClick={gameState.startGame}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors text-xl font-bold"
            >
              Start Game
            </button>
            <div className="mt-6 p-4 bg-white/90 rounded-lg border-2 border-green-500">
              <h3 className="font-bold mb-2 text-xl text-center">How to Play:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Items move along the conveyor belt, getting faster over time</li>
                <li>Press number keys 1-4 to sort waste into the correct bins:</li>
                <li className="ml-4">- 1: Paper (newspapers, cardboard)</li>
                <li className="ml-4">- 2: Glass (bottles, jars)</li>
                <li className="ml-4">- 3: Food (organic waste)</li>
                <li className="ml-4">- 4: General (non-recyclable items)</li>
                <li>+10 points for correct sorting</li>
                <li>-5 points for incorrect sorting</li>
                <li>-10 points if an item falls off the end of the belt</li>
                <li>£0.50 fine for each incorrect sort or missed item</li>
              </ul>
            </div>
          </div>
        </div>
      ) : gameState.gameEnded ? (
        // Game summary screen
        <GameSummary
          score={gameState.score}
          gbpLost={gameState.gbpLost}
          sortingHistory={gameState.sortingHistory}
          onPlayAgain={gameState.playAgain}
        />
      ) : (
        // Active gameplay
        <>
          <ScoreBoard
            score={gameState.score}
            timeLeft={gameState.timeLeft}
            beltSpeed={gameState.beltSpeed}
            gbpLost={gameState.gbpLost}
          />

          {/* Current action display */}
          {gameState.currentAction && (
            <div className="absolute top-16 left-0 right-0 flex justify-center">
              <div className="bg-white/80 px-6 py-3 rounded-md font-bold text-xl text-green-800 shadow-md">
                {gameState.currentAction}
              </div>
            </div>
          )}

          {/* Render character */}
          <Character x={gameState.characterPosition.x} y={gameState.characterPosition.y} holdingItem={false} />

          {/* Render current item on belt */}
          {gameState.currentItem && <WasteItem item={gameState.currentItem} />}

          {/* Number key controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex gap-2">
              {gameState.config.bins.map((bin) => (
                <button
                  key={bin.type}
                  className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center 
                    ${gameState.isMoving ? "opacity-50 cursor-not-allowed" : "hover:bg-white/30 active:bg-white/50"}`}
                  onClick={() => !gameState.isMoving && handleNumberKey(bin.number)}
                  disabled={gameState.isMoving}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold
                    ${
                      bin.type === "paper"
                        ? "bg-blue-500 text-white"
                        : bin.type === "glass"
                          ? "bg-green-500 text-white"
                          : bin.type === "food"
                            ? "bg-brown-500 text-white"
                            : "bg-gray-500 text-white"
                    }`}
                  >
                    {bin.number}
                  </div>
                  <div className="text-xs mt-1 font-medium">{bin.type}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

