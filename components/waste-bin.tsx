import type { WasteType } from "@/types/game-types"

interface WasteBinProps {
  type: WasteType
  x: number
  y: number
  number: number
}

export default function WasteBin({ type, x, y, number }: WasteBinProps) {
  const getBinColor = () => {
    switch (type) {
      case "paper":
        return "bg-blue-500 border-blue-700"
      case "glass":
        return "bg-green-500 border-green-700"
      case "food":
        return "bg-brown-500 border-brown-700"
      case "general":
        return "bg-gray-500 border-gray-700"
      default:
        return "bg-gray-500 border-gray-700"
    }
  }

  const getBinIcon = () => {
    switch (type) {
      case "paper":
        return "📄"
      case "glass":
        return "🍶"
      case "food":
        return "🍎"
      case "general":
        return "🗑️"
      default:
        return "♻️"
    }
  }

  return (
    <div
      className={`absolute w-20 h-20 ${getBinColor()} rounded-md border-4 flex flex-col items-center justify-center shadow-lg z-10`}
      style={{
        transform: `translate(${x - 40}px, ${y - 40}px)`,
      }}
    >
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-gray-800 border-2 border-gray-400 shadow-md">
        {number}
      </div>
      <div className="text-2xl mb-1">{getBinIcon()}</div>
      <div className="text-white text-xs font-bold uppercase">{type}</div>
    </div>
  )
}

