export default function FloatingHexagons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large floating hexagons */}
      <div
        className="absolute w-64 h-64 hexagon bg-jade-500/5 animate-float"
        style={{ top: "10%", left: "5%", animationDelay: "0s" }}
      />
      <div
        className="absolute w-48 h-48 hexagon bg-jade-500/5 animate-float"
        style={{ top: "60%", left: "80%", animationDelay: "1s" }}
      />
      <div
        className="absolute w-32 h-32 hexagon bg-jade-500/5 animate-float"
        style={{ top: "30%", left: "70%", animationDelay: "2s" }}
      />
      <div
        className="absolute w-56 h-56 hexagon bg-jade-500/5 animate-float"
        style={{ top: "70%", left: "20%", animationDelay: "3s" }}
      />

      {/* Small glowing hexagons */}
      <div
        className="absolute w-8 h-8 hexagon bg-jade-500/30 animate-pulse-slow"
        style={{ top: "15%", left: "25%", animationDelay: "0s" }}
      />
      <div
        className="absolute w-6 h-6 hexagon bg-jade-500/30 animate-pulse-slow"
        style={{ top: "65%", left: "85%", animationDelay: "1s" }}
      />
      <div
        className="absolute w-10 h-10 hexagon bg-jade-500/30 animate-pulse-slow"
        style={{ top: "35%", left: "55%", animationDelay: "2s" }}
      />
      <div
        className="absolute w-5 h-5 hexagon bg-jade-500/30 animate-pulse-slow"
        style={{ top: "75%", left: "35%", animationDelay: "3s" }}
      />

      {/* Animated gradient orbs */}
      <div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-jade-500/10 to-emerald-400/5 blur-3xl animate-wave"
        style={{ top: "20%", left: "30%", animationDelay: "0s" }}
      />
      <div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-jade-500/10 to-emerald-400/5 blur-3xl animate-wave"
        style={{ top: "60%", left: "10%", animationDelay: "2s" }}
      />
      <div
        className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-jade-500/10 to-emerald-400/5 blur-3xl animate-wave"
        style={{ top: "40%", left: "70%", animationDelay: "4s" }}
      />
    </div>
  )
}
