import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { Dumbbell } from "lucide-react"

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      setError("")
      setLoading(true)

      const response = await api.post("/auth/signup", {
        name: name,
        email,
        password
      })

      console.log(response.data)
      navigate("/login")

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.")

    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030507] px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(132,255,36,0.24),rgba(48,128,22,0.12)_26%,rgba(3,5,7,0.76)_58%,#030507_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_82%,rgba(119,255,31,0.16),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#030507_0%,transparent_24%,transparent_76%,#030507_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:54px_54px]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center py-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_48px_rgba(132,255,36,0.12)] backdrop-blur-md"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-gray-950 shadow-[0_0_28px_rgba(132,255,36,0.35)]">
              <Dumbbell className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-white">Create account</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Start building your personalized GymAI plan.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-200">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20"
              />
              <div className="mt-3 min-h-6" aria-live="polite">
                {error && (
                  <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full cursor-pointer rounded-xl bg-lime-400 px-6 py-3 font-bold text-gray-950 shadow-[0_0_32px_rgba(132,255,36,0.3)] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-lime-400/70 disabled:shadow-none"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="cursor-pointer font-semibold text-lime-400 hover:text-lime-300"
            >
              Sign in
            </button>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Signup
