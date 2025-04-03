import type { WasteItemType } from "@/types/game-types"

interface WasteItemProps {
  item: WasteItemType
  isDropping?: boolean
}

export default function WasteItem({ item, isDropping = false }: WasteItemProps) {
  const getItemIcon = () => {
    switch (item.type) {
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
    <div
      className={`absolute ${item.collected ? "w-40 h-40" : "w-10 h-10"} 
       rounded-md flex items-center justify-center 
        transition-all duration-300 ${item.collected ? "z-30" : "z-10"} 
        ${item.collected ? "shadow-lg" : ""} 
        ${isDropping ? "animate-bounce opacity-70 scale-75" : ""}`}
      style={{
        transform: `translate(${item.x - (item.collected ? 28 : 20)}px, ${item.y - 28}px)`,
      }}
    >
      <div className={`${item.collected ? "text-8xl" : "text-6xl"}`}>{getItemIcon()}</div>
    </div>
  )
}

