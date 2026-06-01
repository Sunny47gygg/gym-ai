import { Link } from "react-router-dom"
import { Zap } from "lucide-react"

function Hero() {
  return (
    <section className="relative z-10 overflow-hidden bg-[#030507]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(132,255,36,0.28),rgba(48,128,22,0.16)_24%,rgba(3,5,7,0.72)_55%,#030507_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_78%,rgba(119,255,31,0.22),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#030507_0%,rgba(3,5,7,0.58)_18%,transparent_50%,rgba(3,5,7,0.58)_82%,#030507_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#030507_0%,transparent_18%,transparent_76%,#030507_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:54px_54px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex min-h-[calc(100vh-81px)] flex-col items-center justify-center gap-10 py-20 text-center">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-zinc-200 backdrop-blur-md">
            <Zap className="h-5 w-5 text-lime-400" />
            <p className="font-medium">AI-powered training plans</p>
          </div>
          <h1 className="max-w-5xl text-6xl font-bold tracking-normal text-white md:text-8xl">
            Your Perfect <span className="text-lime-400">Gym plan</span> in seconds
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
            Stop guessing. Get a personalized training program built by AI,
            tailored to your goals, experience, and schedule.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex cursor-pointer rounded-xl bg-lime-400 px-10 py-4 font-bold text-gray-900 shadow-[0_0_32px_rgba(132,255,36,0.3)] transition hover:bg-lime-300"
            >
              Get Started Free &#8594;
            </Link>
            <Link
              to="/login"
              className="inline-flex cursor-pointer rounded-xl border border-white/10 bg-[#070b11]/90 px-10 py-4 font-semibold text-white shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:border-lime-400/40"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
