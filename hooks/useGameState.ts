"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { WasteType, WasteItemType, SortingRecord, GameConfig } from "@/types/game-types"
import { correctSound, wrongSound } from "@/lib/sounds"

export function useGameState(config: GameConfig) {
  const { toast } = useToast()
  // Core game state
  const [score, setScore] = useState(0)
  const [gbpLost, setGbpLost] = useState(0)
  const [currentItem, setCurrentItem] = useState<WasteItemType | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [timeLeft, setTimeLeft] = useState(config.gameTime)
  const [beltSpeed, setBeltSpeed] = useState(config.initialBeltSpeed)

  // Animation and interaction state
  const [currentAction, setCurrentAction] = useState<string | null>(null)
  const [characterPosition, setCharacterPosition] = useState(config.startPosition)
  //const [itemPosition, setItemPosition] = useState(config.currentItem)
  const [isMoving, setIsMoving] = useState(false)
  const [sortingHistory, setSortingHistory] = useState<SortingRecord[]>([])
  const [showRedFlash, setShowRedFlash] = useState(false)
  const [showFineAmount, setShowFineAmount] = useState<number | null>(null)

  // Refs for timers and intervals
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const speedIncreaseIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const debugModeRef = useRef<boolean>(true) // Set to false in production

  // Debug log function - only logs if debug mode is enabled
  const debugLog = useCallback((...args: any[]) => {
    if (debugModeRef.current) {
      console.log(...args)
    }
  }, [])

  // Reset character to starting position
  const resetCharacterPosition = useCallback(() => {
    setCharacterPosition(config.startPosition)
    setIsMoving(false)
    setCurrentAction(null)
  }, [config.startPosition])

  // Generate a new waste item - only if there isn't already one
  const generateWasteItem = useCallback(() => {
    // Only generate if there's no current item
    if (currentItem) {
      return null
    }

    const types: WasteType[] = ["paper", "glass", "food", "general"]
    const belt = config.conveyorBelts[0]

    // Speed up the belt by 2% for each new item
    setBeltSpeed((prev) => Math.min(prev * 1.02, 8))

    const newItem = {
      id: Date.now() + Math.random(),
      type: types[Math.floor(Math.random() * types.length)],
      x: belt.x, // Start position at beginning of belt
      y: belt.y - 20, // Position above the belt
      collected: false,
      onBelt: true,
      sortedTo: null,
    }

    debugLog("Generated new item:", newItem)
    setCurrentItem(newItem)
    return newItem
  }, [config.conveyorBelts, currentItem, debugLog])

  // Sort item to bin with animation
  const sortItemToBin = useCallback(
    async (binType: WasteType, binPosition: { x: number; y: number }) => {
      if (!currentItem || isMoving) return

      setIsMoving(true)
      setCurrentAction(`Sorting ${currentItem.type} to ${binType} bin`)

      // Store the item info before removing it from the belt
      const itemToSort = { ...currentItem }

      // Remove the item from the belt
      // setCurrentItem(null)
      // TODO: Move item to bin

      // Check if correct bin
      const isCorrect = binType === itemToSort.type

      // Update score
      if (isCorrect) {
        correctSound.play();
        setScore((prev) => prev + 10)
        toast({
          title: "Correct!",
          description: `+10 points for sorting ${itemToSort.type} waste correctly!`,
          variant: "success",
        })
      } else {
        wrongSound.play();
        setScore((prev) => Math.max(0, prev - 5))
        showPenalty(0.5) // 50p fine for incorrect sorting

        toast({
          title: "Incorrect sorting!",
          description: `${itemToSort.type} waste doesn't go in the ${binType} bin. -5 points! £0.50 fine!`,
          variant: "destructive",
        })
      }

      // Animate character moving to the bin
      // This is a simplified animation - we'll just use timeouts
      const animationDuration = 1000 // 1 second

      // Move character to bin
      setCharacterPosition(binPosition)
      setCurrentItem({
        ...currentItem,
        x: binPosition.x,
        y: binPosition.y,
      })

      // Wait for animation to complete
      await new Promise((resolve) => {
        animationTimeoutRef.current = setTimeout(resolve, animationDuration)
      })

      setCurrentItem(null)

      // Add to sorting history
      addToSortingHistory({
        id: itemToSort.id,
        itemType: itemToSort.type,
        sortedTo: binType,
        isCorrect,
      })

      // Return character to starting position
      setCharacterPosition(config.startPosition)

      // Wait for return animation
      await new Promise((resolve) => {
        animationTimeoutRef.current = setTimeout(resolve, animationDuration / 2)
      })

      // Reset state
      setIsMoving(false)
      setCurrentAction(null)

      // Generate new item after a short delay
      setTimeout(() => {
        generateWasteItem()
      }, 300)
    },
    [currentItem, isMoving, generateWasteItem, config.startPosition, toast],
  )

  // End game and show summary
  const endGame = useCallback(() => {
    setGameStarted(false)
    setGameEnded(true)

    // Clean up all timers and intervals
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (speedIncreaseIntervalRef.current) {
      clearInterval(speedIncreaseIntervalRef.current)
      speedIncreaseIntervalRef.current = null
    }

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }

    toast({
      title: "Game Over!",
      description: `Your final score is ${score}`,
    })
  }, [score, toast])

  // Start game
  const startGame = useCallback(() => {
    // Reset all game state
    setScore(0)
    setGbpLost(0)
    setTimeLeft(config.gameTime)
    setCurrentItem(null)
    setBeltSpeed(config.initialBeltSpeed)
    setCurrentAction(null)
    setCharacterPosition(config.startPosition)
    setIsMoving(false)
    setSortingHistory([])
    setShowRedFlash(false)
    setShowFineAmount(null)
    setGameStarted(true)
    setGameEnded(false)

    // Clear any existing timeouts and intervals
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }

    if (speedIncreaseIntervalRef.current) {
      clearInterval(speedIncreaseIntervalRef.current)
      speedIncreaseIntervalRef.current = null
    }

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }

    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    debugLog("Game started")

    // Start speed increase interval
    speedIncreaseIntervalRef.current = setInterval(() => {
      setBeltSpeed((prev) => Math.min(prev + 0.1, 8)) // Increase speed up to a maximum
    }, 10000) // Increase speed every 10 seconds

    // Generate the first item after a short delay
    setTimeout(() => {
      generateWasteItem()
    }, 500)
  }, [config, debugLog, generateWasteItem, endGame])

  // Play again function
  const playAgain = useCallback(() => {
    setGameEnded(false)
    startGame()
  }, [startGame])

  // Show penalty
  const showPenalty = useCallback((amount: number) => {
    setScore((prev) => Math.max(0, prev - 10))
    setGbpLost((prev) => prev + amount)

    // Show red flash and fine amount
    setShowRedFlash(true)
    setShowFineAmount(amount)
    setTimeout(() => {
      setShowRedFlash(false)
      setTimeout(() => setShowFineAmount(null), 2000)
    }, 500)
  }, [])

  // Add to sorting history
  const addToSortingHistory = useCallback((record: Omit<SortingRecord, "timestamp">) => {
    setSortingHistory((prev) => [
      ...prev,
      {
        ...record,
        timestamp: Date.now(),
      },
    ])
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (speedIncreaseIntervalRef.current) {
        clearInterval(speedIncreaseIntervalRef.current)
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  return {
    // State
    score,
    setScore,
    gbpLost,
    setGbpLost,
    currentItem,
    setCurrentItem,
    gameStarted,
    setGameStarted,
    gameEnded,
    setGameEnded,
    timeLeft,
    setTimeLeft,
    beltSpeed,
    setBeltSpeed,
    currentAction,
    setCurrentAction,
    characterPosition,
    setCharacterPosition,
    isMoving,
    setIsMoving,
    sortingHistory,
    setSortingHistory,
    showRedFlash,
    setShowRedFlash,
    showFineAmount,
    setShowFineAmount,

    // Refs
    gameLoopRef,
    timerRef,
    speedIncreaseIntervalRef,
    animationTimeoutRef,
    debugModeRef,

    // Functions
    debugLog,
    resetCharacterPosition,
    generateWasteItem,
    sortItemToBin,
    startGame,
    endGame,
    playAgain,
    showPenalty,
    addToSortingHistory,

    // Config
    config,
  }
}

