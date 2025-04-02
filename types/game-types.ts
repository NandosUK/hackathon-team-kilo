// Define waste types
export type WasteType = "paper" | "glass" | "food" | "general"

// Define waste item interface
export interface WasteItemType {
  id: number
  type: WasteType
  x: number
  y: number
  collected: boolean
  onBelt: boolean
  sortedTo: WasteType | null
}

// Define bin interface
export interface BinType {
  type: WasteType
  x: number
  y: number
  width: number
  height: number
  number: number // Number key to press
}

// Define conveyor belt interface
export interface ConveyorBeltType {
  id: number
  x: number
  y: number
  width: number
  direction: "left" | "right"
  speed: number
}

// Define sorting record for summary
export interface SortingRecord {
  id: number
  itemType: WasteType
  sortedTo: WasteType | null
  isCorrect: boolean
  timestamp: number
}

// Define game state interface
export interface GameState {
  score: number
  gbpLost: number
  currentItem: WasteItemType | null
  gameStarted: boolean
  gameEnded: boolean
  timeLeft: number
  beltSpeed: number
  currentAction: string | null
  characterPosition: { x: number; y: number }
  holdingItem: WasteItemType | null
  isMoving: boolean
  sortingHistory: SortingRecord[]
  showRedFlash: boolean
  showFineAmount: number | null
  isItemDropping: boolean
}

// Define game config
export interface GameConfig {
  startPosition: { x: number; y: number }
  bins: BinType[]
  conveyorBelts: ConveyorBeltType[]
  initialBeltSpeed: number
  gameTime: number
}

