import { Trophy, Medal } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import FloatingHexagons from "@/components/floating-hexagons"

export default function LeaderboardPage() {
  const leaderboardData = [
    { rank: 1, username: "JadeMaster", score: 9850, avatar: "/placeholder.svg?height=100&width=100" },
    { rank: 2, username: "EmeraldQueen", score: 9720, avatar: "/placeholder.svg?height=100&width=100" },
    { rank: 3, username: "VoidWalker", score: 9580, avatar: "/placeholder.svg?height=100&width=100" },
    { rank: 4, username: "CrystalHunter", score: 9350, avatar: "/placeholder.svg?height=100&width=100" },
    { rank: 5, username: "JadeRider", score: 9200, avatar: "/placeholder.svg?height=100&width=100" },
    { rank: 6, username: "GlowStorm", score: 9050, avatar: "/placeholder.svg?height=100&width=100" },
    { rank: 7, username: "LaserFocus", score: 8900, avatar: "/placeholder.svg?height=100&width=100" },
    { rank: 8, username: "JadeShadow", score: 8750, avatar: "/placeholder.svg?height=100&width=100" },
    { rank: 9, username: "VirtualPhantom", score: 8600, avatar: "/placeholder.svg?height=100&width=100" },
    { rank: 10, username: "EmeraldDreamer", score: 8450, avatar: "/placeholder.svg?height=100&width=100" },
  ]

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated background */}
      <AnimatedBackground />
      <FloatingHexagons />

      {/* Main content */}
      <main className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 ml-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Trophy className="h-8 w-8 text-jade-400 mr-3 animate-float" />
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              <span className="text-gradient relative">
                Leaderboard
                <span className="absolute -inset-1 blur-md bg-jade-500/30 -z-10 rounded-lg"></span>
              </span>
            </h1>
          </div>

          <div className="glass rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-jade-500/20 bg-jade-900/20">
              <div className="col-span-1 font-bold text-white/80">#</div>
              <div className="col-span-7 font-bold text-white/80">Player</div>
              <div className="col-span-4 font-bold text-white/80 text-right">Score</div>
            </div>

            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className={`grid grid-cols-12 gap-4 p-4 items-center ${
                  player.rank <= 3 ? "bg-jade-900/10" : ""
                } hover:bg-jade-900/20 transition-colors duration-300 transform hover:scale-[1.01]`}
              >
                <div className="col-span-1 font-bold text-2xl">
                  {player.rank === 1 ? (
                    <Medal className="h-6 w-6 text-yellow-400 animate-pulse-slow" />
                  ) : player.rank === 2 ? (
                    <Medal className="h-6 w-6 text-gray-300 animate-pulse-slow" />
                  ) : player.rank === 3 ? (
                    <Medal className="h-6 w-6 text-amber-600 animate-pulse-slow" />
                  ) : (
                    <span className="text-white/60">{player.rank}</span>
                  )}
                </div>
                <div className="col-span-7 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-jade-600 mr-3 overflow-hidden">
                    <img
                      src={player.avatar || "/placeholder.svg"}
                      alt={player.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`font-medium ${player.rank <= 3 ? "text-white" : "text-white/80"}`}>
                    {player.username}
                  </span>
                  {player.rank === 1 && (
                    <span className="ml-2 px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full">
                      Champion
                    </span>
                  )}
                </div>
                <div
                  className={`col-span-4 text-right font-mono font-bold ${
                    player.rank === 1
                      ? "text-yellow-400"
                      : player.rank === 2
                        ? "text-gray-300"
                        : player.rank === 3
                          ? "text-amber-600"
                          : "text-white/80"
                  }`}
                >
                  {player.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jade glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-jade-900/50 to-transparent z-0"></div>
      </main>
    </div>
  )
}
