import { Rocket, Code, Gamepad2, Sparkles, Users } from "lucide-react"
import AnimatedText from "@/components/animated-text"

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="mb-8 relative">
            <div className="absolute -inset-1 bg-jade-500/30 blur-xl rounded-full"></div>
            <div className="relative w-24 h-24 mx-auto hexagon bg-gradient-to-br from-jade-400 to-jade-600 flex items-center justify-center animate-spin-slow">
              <Rocket className="h-10 w-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            About <AnimatedText text="JadeVerse" className="text-gradient" />
          </h1>

          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            The ultimate gaming platform with stunning visuals and immersive experiences
          </p>
        </div>

        <div className="space-y-16">
          <section className="glass rounded-2xl p-8 border border-jade-500/20">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <Sparkles className="h-8 w-8 text-jade-400 mr-3" />
              Our Vision
            </h2>
            <p className="text-white/80 text-lg mb-4">
              JadeVerse was created with a simple yet ambitious vision: to build a gaming platform that combines
              cutting-edge technology with stunning aesthetics to deliver unforgettable gaming experiences.
            </p>
            <p className="text-white/80 text-lg">
              We believe that games should be more than just entertainment—they should be immersive journeys that
              transport players to new worlds, challenge their skills, and connect them with a community of like-minded
              individuals.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <Gamepad2 className="h-8 w-8 text-jade-400 mr-3" />
              What We Offer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6 border border-jade-500/20 hover:border-jade-500/50 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-lg bg-jade-500/20 flex items-center justify-center mb-4">
                  <Gamepad2 className="h-6 w-6 text-jade-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Curated Games</h3>
                <p className="text-white/70">
                  A handpicked selection of the best games across various genres, from action-packed adventures to
                  mind-bending puzzles.
                </p>
              </div>

              <div className="glass rounded-xl p-6 border border-jade-500/20 hover:border-jade-500/50 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-lg bg-jade-500/20 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-jade-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Custom Games</h3>
                <p className="text-white/70">
                  Create and share your own games with our community, showcasing your creativity and unique ideas.
                </p>
              </div>

              <div className="glass rounded-xl p-6 border border-jade-500/20 hover:border-jade-500/50 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-lg bg-jade-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-jade-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Stunning Visuals</h3>
                <p className="text-white/70">
                  Immerse yourself in our beautiful jade-themed interface with smooth animations and eye-catching
                  effects.
                </p>
              </div>

              <div className="glass rounded-xl p-6 border border-jade-500/20 hover:border-jade-500/50 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-lg bg-jade-500/20 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-jade-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Community</h3>
                <p className="text-white/70">
                  Connect with fellow gamers, share experiences, and build lasting friendships in our vibrant community.
                </p>
              </div>
            </div>
          </section>

          <section className="glass rounded-2xl p-8 border border-jade-500/20">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <Code className="h-8 w-8 text-jade-400 mr-3" />
              Our Technology
            </h2>
            <p className="text-white/80 text-lg mb-4">
              JadeVerse is built using cutting-edge web technologies to ensure a smooth, responsive, and visually
              stunning experience. Our platform leverages the latest advancements in web development to create immersive
              gaming environments.
            </p>
            <p className="text-white/80 text-lg">
              From real-time animations to interactive elements, we've crafted every aspect of JadeVerse to deliver a
              next-generation gaming platform that pushes the boundaries of what's possible on the web.
            </p>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Join Us Today</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Become part of the JadeVerse community and embark on an unforgettable gaming journey. Create an account to
              access all our features and start playing right away. Jadeverse was developed by Sawyer
            </p>
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-jade-500/30 blur-xl rounded-full"></div>
              <a
                href="/login"
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-jade-600 to-emerald-500 rounded-full hover:from-jade-500 hover:to-emerald-400 transition-all duration-300 shadow-lg hover:shadow-jade-500/50"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Join JadeVerse
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
