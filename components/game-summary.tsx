"use client"

import type { SortingRecord, WasteType } from "@/types/game-types"

interface GameSummaryProps {
  score: number
  gbpLost: number
  sortingHistory: SortingRecord[]
  onPlayAgain: () => void
}

export default function GameSummary({ score, gbpLost, sortingHistory, onPlayAgain }: GameSummaryProps) {
  // Calculate statistics
  const totalItems = sortingHistory.length
  const correctItems = sortingHistory.filter((record) => record.isCorrect).length
  const incorrectItems = sortingHistory.filter((record) => !record.isCorrect && record.sortedTo !== null).length
  const missedItems = sortingHistory.filter((record) => record.sortedTo === null).length

  // Get icon for waste type
  const getItemIcon = (type: WasteType) => {
    switch (type) {
      case "paper":
        return "📄"
      case "glass":
        return "🥛"
      case "food":
        return "🍌"
      case "general":
        return "🧴"
      default:
        return "🗑️"
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start pt-8 z-10 overflow-y-auto">
      <div className="bg-yellow-100 p-6 rounded-lg border-4 border-yellow-500 shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-green-800 mb-4 text-center font-serif">Game Over!</h2>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg text-center border-2 border-green-500 shadow-md">
            <div className="text-lg font-bold font-serif">Final Score</div>
            <div className="text-3xl font-mono">{score}</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center border-2 border-red-500 shadow-md">
            <div className="text-lg font-bold font-serif">Money Lost</div>
            <div className="text-3xl text-red-600 font-mono">£{gbpLost.toFixed(2)}</div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white p-4 rounded-lg w-full mb-6 border-2 border-blue-500 shadow-md">
          <h3 className="font-bold text-xl mb-2 text-center font-serif">Statistics</h3>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>Total Items:</div>
            <div className="text-right font-medium">{totalItems}</div>

            <div>Correctly Sorted:</div>
            <div className="text-right font-medium text-green-600">{correctItems}</div>

            <div>Incorrectly Sorted:</div>
            <div className="text-right font-medium text-red-600">{incorrectItems}</div>

            <div>Missed Items:</div>
            <div className="text-right font-medium text-orange-600">{missedItems}</div>

            <div>Accuracy:</div>
            <div className="text-right font-medium">
              {totalItems > 0 ? Math.round((correctItems / totalItems) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Sorting history */}
        {sortingHistory.length > 0 && (
          <div className="bg-white p-4 rounded-lg w-full mb-6 border-2 border-purple-500 shadow-md">
            <h3 className="font-bold text-xl mb-2 text-center font-serif">Sorting History</h3>
            <div className="max-h-[200px] overflow-y-auto">
              <table className="w-full font-mono">
                <thead>
                  <tr className="border-b-2 border-gray-400">
                    <th className="text-left py-2">Item</th>
                    <th className="text-left py-2">Sorted To</th>
                    <th className="text-right py-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {sortingHistory.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200">
                      <td className="py-2">
                        <span className="mr-2">{getItemIcon(record.itemType)}</span>
                        {record.itemType}
                      </td>
                      <td className="py-2">
                        {record.sortedTo ? (
                          <>
                            <span className="mr-2">{getItemIcon(record.sortedTo)}</span>
                            {record.sortedTo}
                          </>
                        ) : (
                          <span className="text-orange-600">Missed</span>
                        )}
                      </td>
                      <td className="text-right py-2">
                        {record.isCorrect ? (
                          <span className="text-green-600 text-xl">✓</span>
                        ) : (
                          <span className="text-red-600 text-xl">✗</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Play again button */}
        <button
          onClick={onPlayAgain}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors text-xl font-bold shadow-md"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}

