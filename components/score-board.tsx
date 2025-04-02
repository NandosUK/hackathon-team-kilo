interface ScoreBoardProps {
  score: number
  timeLeft: number
  beltSpeed?: number
  gbpLost?: number
}

export default function ScoreBoard({ score, timeLeft, beltSpeed = 1, gbpLost = 0 }: ScoreBoardProps) {
  return (
    <div className="absolute top-2 left-0 right-0 flex justify-between px-4 z-10">
      <div className="bg-white/90 px-4 py-2 rounded-md border-2 border-green-500 shadow-md">
        <span className="font-bold font-mono">Score:</span> {score}
      </div>
      <div className="bg-white/90 px-4 py-2 rounded-md border-2 border-red-500 shadow-md">
        <span className="font-bold font-mono">Fines:</span> £{gbpLost.toFixed(2)}
      </div>
      <div className="bg-white/90 px-4 py-2 rounded-md border-2 border-blue-500 shadow-md">
        <span className="font-bold font-mono">Speed:</span> {beltSpeed.toFixed(1)}x
      </div>
      <div className="bg-white/90 px-4 py-2 rounded-md border-2 border-yellow-500 shadow-md" data-time-left={timeLeft}>
        <span className="font-bold font-mono">Time:</span> {timeLeft}s
      </div>
    </div>
  )
}

