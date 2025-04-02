"use client"

import { useCallback, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { BinType, WasteType, WasteItemType } from "@/types/game-types"

interface GameControlsProps {
  gameStarted: boolean
  isMoving: boolean
  bins: BinType[]
  currentItem: WasteItemType | null
  sortItemToBin: (binType: WasteType, binPosition: { x: number; y: number }) => void
  debugLog: (...args: any[]) => void
}

export function useGameControls({
  gameStarted,
  isMoving,
  bins,
  currentItem,
  sortItemToBin,
  debugLog,
}: GameControlsProps) {
  const { toast } = useToast()

  // Handle number key press (1-4) with animation
  const handleNumberKey = useCallback(
    (binNumber: number) => {
      // Don't allow new actions while already moving
      if (isMoving) return

      // Find the selected bin
      const selectedBin = bins.find((bin) => bin.number === binNumber)
      if (!selectedBin) return

      debugLog(`Selected bin ${binNumber}: ${selectedBin.type}`)

      // Check if there's an item on the belt
      if (currentItem && currentItem.onBelt) {
        // Sort the item to the selected bin with animation
        sortItemToBin(selectedBin.type, { x: selectedBin.x, y: selectedBin.y })
      } else {
        toast({
          title: "No item to sort",
          description: "Wait for an item to appear on the conveyor belt",
          variant: "default",
        })
      }
    },
    [isMoving, bins, currentItem, sortItemToBin, toast, debugLog],
  )

  // Handle keyboard input - simplified to only use number keys
  useEffect(() => {
    if (!gameStarted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle number keys 1-4
      if (e.key >= "1" && e.key <= "4") {
        const binNumber = Number.parseInt(e.key)
        handleNumberKey(binNumber)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameStarted, handleNumberKey])

  return {
    handleNumberKey,
  }
}

