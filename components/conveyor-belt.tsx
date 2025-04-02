import type { ConveyorBeltType } from "@/types/game-types"

interface ConveyorBeltProps {
  belt: ConveyorBeltType
  speed: number
}

export default function ConveyorBelt({ belt, speed }: ConveyorBeltProps) {
  return (
    <div
      className="absolute h-10 bg-gray-700 rounded-md flex items-center overflow-hidden shadow-lg z-5 border-2 border-gray-900"
      style={{
        width: `${belt.width}px`,
        transform: `translate(${belt.x}px, ${belt.y}px)`,
      }}
    >
      {/* Conveyor belt segments */}
      {Array.from({ length: Math.ceil(belt.width / 40) }).map((_, index) => (
        <div
          key={index}
          className={`h-full w-[40px] flex items-center justify-center relative ${
            belt.direction === "right" ? "animate-conveyor-right" : "animate-conveyor-left"
          }`}
          style={{
            animationDuration: `${2 / speed}s`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-1 bg-gray-500"></div>
          </div>
          <div className="w-full h-6 border-x-2 border-gray-500 flex items-center justify-center">
            <div className="w-4 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

