import type { WasteItemType } from "@/types/game-types"

// Ensure character returns to starting position
export async function returnToStartPosition(
  characterPosition: { x: number; y: number },
  startPosition: { x: number; y: number },
  moveCharacterWithAnimation: (fromX: number, fromY: number, toX: number, toY: number, speed?: number) => Promise<void>,
  setCurrentAction: (action: string | null) => void,
  resetCharacterPosition: () => void,
) {
  try {
    setCurrentAction("Returning to belt")
    await moveCharacterWithAnimation(
      characterPosition.x,
      characterPosition.y,
      startPosition.x,
      startPosition.y,
      2, // Faster return
    )

    setCurrentAction(null)
    return true
  } catch (error) {
    console.error("Return animation error:", error)
    // Force reset to starting position if animation fails
    resetCharacterPosition()
    return false
  }
}

// Update item position to stay above character
export function updateItemPosition(item: WasteItemType, characterPosition: { x: number; y: number }): WasteItemType {
  return {
    ...item,
    x: characterPosition.x,
    y: characterPosition.y - 30, // Position item directly above character
  }
}

