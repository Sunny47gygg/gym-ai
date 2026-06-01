import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Dumbbell, LoaderCircle, Sparkles } from "lucide-react"
import api from "../api/axios"
import ProfileCard from "../components/ProfileCard"

const initialProfile = {
  age: "",
  gender: "",
  height_cm: "",
  weight_kg: "",
  activity_level: "",
  goal: "",
  target_weight: "",
  experience_level: "",
  workout_days: "",
  injuries: "None",
  dietary_preferences: "",
}

const injuryOptions = ["None", "Shoulder", "Lower Back", "Knee", "Elbow", "Wrist", "Ankle"]

function Onboarding() {
  const [profile, setProfile] = useState(initialProfile)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }))
  }

  const handleInjuryToggle = (injury) => {
    setProfile((currentProfile) => {
      const currentInjuries = currentProfile.injuries
        .split(", ")
        .filter(Boolean)

      if (injury === "None") {
        return {
          ...currentProfile,
          injuries: "None",
        }
      }

      const injuriesWithoutNone = currentInjuries.filter((item) => item !== "None")
      const nextInjuries = injuriesWithoutNone.includes(injury)
        ? injuriesWithoutNone.filter((item) => item !== injury)
        : [...injuriesWithoutNone, injury]

      return {
        ...currentProfile,
        injuries: nextInjuries.length > 0 ? nextInjuries.join(", ") : "None",
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setError("")
      setLoading(true)
      setLoadingMessage("Saving your profile...")

      const token = localStorage.getItem("token")
      const headers = {
        Authorization: token,
      }

      await api.post(
        "/profile",
        {
          ...profile,
          age: Number(profile.age),
          height_cm: Number(profile.height_cm),
          weight_kg: Number(profile.weight_kg),
          target_weight: Number(profile.target_weight),
          workout_days: Number(profile.workout_days),
        },
        { headers },
      )

      setLoadingMessage("Generating your personalized AI plan...")

      const generateResponse = await api.post(
        "/workout/generate",
        {},
        { headers },
      )

      setLoadingMessage("Preparing your dashboard...")
      navigate("/dashboard", {
        state: { workoutPlan: generateResponse.data.workoutPlan },
      })
    } catch (err) {
      setError(err.response?.data?.message || "Unable to generate your plan. Please try again.")
    } finally {
      setLoading(false)
      setLoadingMessage("")
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030507] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(132,255,36,0.22),rgba(48,128,22,0.12)_26%,rgba(3,5,7,0.78)_58%,#030507_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_86%,rgba(119,255,31,0.16),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#030507_0%,transparent_24%,transparent_76%,#030507_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:54px_54px]" />

      <nav className="relative z-20 border-b border-white/10 bg-black/70 px-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-5">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-lime-400" />
            <p className="text-xl font-semibold">GymAI</p>
          </div>

          <ProfileCard subtitle="Setup in progress" />
        </div>
      </nav>

      <section className="relative z-10 mx-auto flex max-w-5xl items-center justify-center px-6 py-12">
        {loading ? (
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_0_48px_rgba(132,255,36,0.12)] backdrop-blur-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400 text-gray-950 shadow-[0_0_32px_rgba(132,255,36,0.35)]">
              <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white">Building your dashboard</h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-400">
              {loadingMessage || "Generating your personalized AI plan..."}
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-lime-400 shadow-[0_0_24px_rgba(132,255,36,0.4)]" />
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_48px_rgba(132,255,36,0.12)] backdrop-blur-md"
          >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-gray-950 shadow-[0_0_28px_rgba(132,255,36,0.35)]">
              <Sparkles className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-white">Build your profile</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Tell GymAI about your body, goals, and training style. Then we will generate your plan.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="age" className="mb-2 block text-sm font-medium text-zinc-200">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={profile.age}
                onChange={handleChange}
                placeholder="22"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div>
              <label htmlFor="gender" className="mb-2 block text-sm font-medium text-zinc-200">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="height_cm" className="mb-2 block text-sm font-medium text-zinc-200">
                Height
              </label>
              <input
                id="height_cm"
                name="height_cm"
                type="number"
                value={profile.height_cm}
                onChange={handleChange}
                placeholder="Height in cm"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div>
              <label htmlFor="weight_kg" className="mb-2 block text-sm font-medium text-zinc-200">
                Weight
              </label>
              <input
                id="weight_kg"
                name="weight_kg"
                type="number"
                value={profile.weight_kg}
                onChange={handleChange}
                placeholder="Weight in kg"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div>
              <label htmlFor="activity_level" className="mb-2 block text-sm font-medium text-zinc-200">
                Activity Level
              </label>
              <select
                id="activity_level"
                name="activity_level"
                value={profile.activity_level}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="">Select activity</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>

            <div>
              <label htmlFor="goal" className="mb-2 block text-sm font-medium text-zinc-200">
                Goal
              </label>
              <select
                id="goal"
                name="goal"
                value={profile.goal}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="">Select goal</option>
                <option value="Fat Loss">Fat Loss</option>
                <option value="Maintain">Maintain</option>
                <option value="Lean Bulk">Lean Bulk</option>
                <option value="Muscle Bulk">Muscle Bulk</option>
              </select>
            </div>

            <div>
              <label htmlFor="target_weight" className="mb-2 block text-sm font-medium text-zinc-200">
                Target Weight
              </label>
              <input
                id="target_weight"
                name="target_weight"
                type="number"
                value={profile.target_weight}
                onChange={handleChange}
                placeholder="Target in kg"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div>
              <label htmlFor="experience_level" className="mb-2 block text-sm font-medium text-zinc-200">
                Experience Level
              </label>
              <select
                id="experience_level"
                name="experience_level"
                value={profile.experience_level}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="">Select experience</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor="workout_days" className="mb-2 block text-sm font-medium text-zinc-200">
                Workout Days
              </label>
              <input
                id="workout_days"
                name="workout_days"
                type="number"
                min="1"
                max="7"
                value={profile.workout_days}
                onChange={handleChange}
                placeholder="Days per week"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 block text-sm font-medium text-zinc-200">Injuries</p>
              <div className="rounded-xl border border-white/10 bg-[#070b11]/90 p-3">
                <div className="flex flex-wrap gap-3">
                  {injuryOptions.map((injury) => {
                    const selected = profile.injuries.split(", ").includes(injury)

                    return (
                      <button
                        key={injury}
                        type="button"
                        onClick={() => handleInjuryToggle(injury)}
                        disabled={loading}
                        className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70 ${
                          selected
                            ? "border-lime-400 bg-lime-400 text-gray-950 shadow-[0_0_20px_rgba(132,255,36,0.2)]"
                            : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-lime-400/50 hover:text-white"
                        }`}
                      >
                        {injury}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  Select all that apply so GymAI can avoid risky movements.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="dietary_preferences" className="mb-2 block text-sm font-medium text-zinc-200">
                Dietary Preferences
              </label>
              <input
                id="dietary_preferences"
                name="dietary_preferences"
                type="text"
                value={profile.dietary_preferences}
                onChange={handleChange}
                placeholder="Vegetarian, high-protein, etc."
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>
          </div>

          <div className="mt-5 min-h-6" aria-live="polite">
            {error && (
              <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full cursor-pointer rounded-xl bg-lime-400 px-6 py-3 font-bold text-gray-950 shadow-[0_0_32px_rgba(132,255,36,0.3)] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-lime-400/70 disabled:shadow-none"
          >
            Generate AI Plan
          </button>
          </form>
        )}
      </section>
    </main>
  )
}

export default Onboarding
