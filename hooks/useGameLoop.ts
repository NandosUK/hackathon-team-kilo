"use client"

import type React from "react"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { WasteItemType } from "@/types/game-types"

interface GameLoopProps {
  gameStarted: boolean
  isMoving: boolean
  currentItem: WasteItemType | null
  setCurrentItem: (item: WasteItemType | null) => void
  beltSpeed: number
  conveyorBelts: any[]
  generateWasteItem: () => WasteItemType | null
  showPenalty: (amount: number) => void
  addToSortingHistory: (record: any) => void
  gameLoopRef: React.MutableRefObject<NodeJS.Timeout | null>
  speedIncreaseIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>
  endGame: () => void
}

export function useGameLoop({
  gameStarted,
  isMoving,
  currentItem,
  setCurrentItem,
  beltSpeed,
  conveyorBelts,
  generateWasteItem,
  showPenalty,
  addToSortingHistory,
  gameLoopRef,
  speedIncreaseIntervalRef,
  endGame,
}: GameLoopProps) {
  const { toast } = useToast()

  // Game loop - with continuously moving items
  useEffect(() => {
    // If game is not started, clean up and exit
    if (!gameStarted) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
      if (speedIncreaseIntervalRef.current) {
        clearInterval(speedIncreaseIntervalRef.current)
        speedIncreaseIntervalRef.current = null
      }
      return
    }

    // Generate initial item if needed
    if (!currentItem && !isMoving) {
      generateWasteItem()
    }

    // Set up the game loop
    gameLoopRef.current = setInterval(() => {
      // Don't move items if character is moving (during animation)
      if (isMoving) return

      // If there's no current item, generate one
      if (!currentItem) {
        generateWasteItem()
        return
      }

      // If the item is not on the belt, don't move it
      if (!currentItem.onBelt) return

      // Move the item along the conveyor belt
      const belt = conveyorBelts[0]
      const newX = currentItem.x + beltSpeed * 3 // Move based on current belt speed

      // Check if item has completely passed the right edge of the belt
      if (newX > belt.x + belt.width + 320) {
        new Audio('/sounds/fast-boo.mp3').play();

        // Apply penalty for missed item
        showPenalty(0.5) // 50p fine for missed item

        // Add to sorting history
        addToSortingHistory({
          id: currentItem.id,
          itemType: currentItem.type,
          sortedTo: null,
          isCorrect: false,
        })

        toast({
          title: "Item Missed!",
          description: "You didn't sort the item in time. -10 points! £0.50 fine!",
          variant: "destructive",
        })

        // Remove the item and generate a new one after a short delay
        setCurrentItem(null)
        setTimeout(() => {
          generateWasteItem()
        }, 500)
      } else {
        // Update the item position
        setCurrentItem({
          ...currentItem,
          x: newX,
        })
      }
    }, 16) // ~60fps for smooth animation

    // Clean up on unmount or when dependencies change
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
      if (speedIncreaseIntervalRef.current) {
        clearInterval(speedIncreaseIntervalRef.current)
        speedIncreaseIntervalRef.current = null
      }
    }
  }, [
    gameStarted,
    isMoving,
    currentItem,
    beltSpeed,
    conveyorBelts,
    generateWasteItem,
    showPenalty,
    addToSortingHistory,
    setCurrentItem,
    gameLoopRef,
    speedIncreaseIntervalRef,
    toast,
  ])
}

