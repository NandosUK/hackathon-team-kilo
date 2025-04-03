import type { WasteItemType } from "@/types/game-types"
import { useMemo } from "react";

interface WasteItemProps {
  item: WasteItemType
  isDropping?: boolean
  itemImage: string
}

const PAPER_ICONS_PATHS = ["/images/waste/plastic-bottle.png","/images/waste/box.png","/images/waste/can.png","/images/waste/tin-can.png"];
const FOOD_ICONS_PATHS = ["/images/waste/bread.png","/images/waste/fish-stake.png","/images/waste/apple.png","/images/waste/fish.png"];
const GLASS_ICONS_PATHS = ["/images/waste/brown-bottle.png","/images/waste/bottle.png","/images/waste/wine-bottle.png"];
const GENERAL_ICONS_PATHS = ["/images/waste/pizza-box.png","/images/waste/coffee-cup.png","/images/waste/juice-box.png"];

export default function WasteItem({ item, isDropping = false, itemImage }: WasteItemProps) {

  const image = useMemo(() => {
    switch (item.type) {
      case "paper":
        return PAPER_ICONS_PATHS[Math.floor(Math.random()*PAPER_ICONS_PATHS.length)];
      case "glass":
        return GLASS_ICONS_PATHS[Math.floor(Math.random()*GLASS_ICONS_PATHS.length)];
      case "food":
        return FOOD_ICONS_PATHS[Math.floor(Math.random()*FOOD_ICONS_PATHS.length)];
      case "general":
        return GENERAL_ICONS_PATHS[Math.floor(Math.random()*GENERAL_ICONS_PATHS.length)];
      default:
        return "🗑️"
    }
  }, [item.type])


  const getItemIcon = () => {
    return <img src={image} alt="Item Icon" className="w-full h-full object-contain z-50 " />
  }

  return (
    <div
      className={`absolute ${"w-20 h-20"} 
       rounded-md flex items-center justify-center 
        transition-all duration-300 ${item.collected ? "z-30" : "z-10"} 
        ${item.collected ? "shadow-lg" : ""} 
        ${isDropping ? "animate-bounce opacity-70 scale-75" : ""}`}
      style={{
        transform: `translate(${item.x - (item.collected ? 28 : 20)}px, ${item.y - 28}px)`,
      }}
    >
      <div className={`${"w-20 h-20"}`}>{getItemIcon()}</div>
    </div>
  )
}

