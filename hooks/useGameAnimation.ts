"use client"

import { useCallback } from "react"
import type { WasteItemType } from "@/types/game-types"

interface AnimationProps {
  characterPosition: { x: number; y: number }
  setCharacterPosition: (position: { x: number; y: number }) => void
  holdingItem: WasteItemType | null
  setHoldingItem: (item: WasteItemType | null) => void
}

export function useGameAnimation({
  characterPosition,
  setCharacterPosition,
  holdingItem,
  setHoldingItem,
}: AnimationProps) {
  // Improved character animation with item carrying
  const moveCharacterWithAnimation = useCallback(
    async (fromX: number, fromY: number, toX: number, toY: number, speed = 1) => {
      return new Promise<void>((resolve) => {
        const distanceX = toX - fromX
        const distanceY = toY - fromY
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

        const duration = distance / speed
        const startTime = Date.now()

        // Fixed offset for the item above the character
        const itemOffsetY = -30 // Position item directly above character

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          const newX = fromX + distanceX * progress
          const newY = fromY + distanceY * progress

          setCharacterPosition({ x: newX, y: newY })
          console.log('sortItemToBin', { newX, newY })

          // Always update held item position if holding one, maintaining the fixed position above character
          if (holdingItem) {
            console.log(newX, newY)
            setHoldingItem({
              ...holdingItem,
              x: newX, // Keep item centered with character
              y: newY + itemOffsetY, // Keep item above character
            })
          }

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            resolve()
          }
        }

        requestAnimationFrame(animate)
      })
    },
    [holdingItem, setCharacterPosition, setHoldingItem],
  )

  return {
    moveCharacterWithAnimation,
  }
}

