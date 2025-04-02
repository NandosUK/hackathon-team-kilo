import Game from "@/components/game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-green-100">
      <h1 className="text-3xl font-bold text-green-800 mb-4">Eco Sorter</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Help keep our planet clean! Move the character with arrow keys or WASD to collect waste items and sort them into
        the correct bins.
      </p>
      <Game />
    </main>
  )
}

