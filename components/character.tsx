interface CharacterProps {
  x: number
  y: number
  holdingItem: boolean
}

export default function Character({ x, y, holdingItem }: CharacterProps) {
  return (
    <div
      className="absolute w-20 h-20 flex items-center justify-center z-20"
      style={{
        transform: `translate(${x - 40}px, ${y - 40}px)`,
        transition: "transform 1s ease-in-out", // Add smooth transition
      }}
    >
      <div className="relative w-full h-full">
        {/* Character image */}
        <img
          src="/images/rooster.png"
          alt="Character"
          className={`w-full h-full object-contain transition-transform duration-300`}
        />
      </div>
    </div>
  )
}

