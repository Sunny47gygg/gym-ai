import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import {
  Activity,
  Calendar,
  Dumbbell,
  Flame,
  LoaderCircle,
  RefreshCw,
  Target,
  TrendingUp,
  Utensils,
} from "lucide-react"
import api from "../api/axios"
import ProfileCard from "../components/ProfileCard"

const normalizeWorkoutPlan = (planResponse) => {
  const plan = planResponse?.plan_data || planResponse

  if (typeof plan === "string") {
    return JSON.parse(plan)
  }

  return plan
}

function Dashboard() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(() => !location.state?.workoutPlan)
  const [error, setError] = useState("")
  const [workoutPlan, setWorkoutPlan] = useState(() => {
    const planFromNavigation = location.state?.workoutPlan
    return planFromNavigation ? normalizeWorkoutPlan(planFromNavigation) : null
  })
  const [profile, setProfile] = useState(null)

  const getAuthHeaders = () => ({
    Authorization: localStorage.getItem("token"),
  })

  const fetchExistingPlan = async () => {
    const response = await api.get("/workout", {
      headers: getAuthHeaders(),
    })

    setWorkoutPlan(normalizeWorkoutPlan(response.data.workoutPlan))
    return response.data.workoutPlan
  }

  const fetchProfile = async () => {
    const response = await api.get("/profile", {
      headers: getAuthHeaders(),
    })

    setProfile(response.data.profile)
    return response.data.profile
  }

  useEffect(() => {
    let ignore = false

    const loadDashboardData = async () => {
      try {
        setError("")

        const planFromNavigation = location.state?.workoutPlan
        let loadedPlan = planFromNavigation ? normalizeWorkoutPlan(planFromNavigation) : null

        const [planResponse, profileResponse] = await Promise.allSettled([
          api.get("/workout", {
            headers: getAuthHeaders(),
          }),
          api.get("/profile", {
            headers: getAuthHeaders(),
          }),
        ])

        if (ignore) {
          return
        }

        if (planResponse.status === "fulfilled") {
          loadedPlan = normalizeWorkoutPlan(planResponse.value.data.workoutPlan)
        }

        if (profileResponse.status === "fulfilled") {
          setProfile(profileResponse.value.data.profile)
        }

        if (!loadedPlan) {
          if (!ignore) {
            setLoading(true)
          }

          const response = await api.post(
            "/workout/generate",
            {},
            {
              headers: getAuthHeaders(),
            },
          )

          if (!ignore) {
            loadedPlan = normalizeWorkoutPlan(response.data.workoutPlan)
          }
        }

        if (!ignore && loadedPlan) {
          setWorkoutPlan(loadedPlan)
        }
      } catch (err) {
        if (!ignore) {
          try {
            await fetchExistingPlan()
            setError("")
          } catch {
            setError(err.response?.data?.message || "Unable to load your plan. Please try again.")
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false)
          setInitialLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      ignore = true
    }
  }, [location.state])

  const handleGeneratePlan = async () => {
    try {
      setError("")
      setLoading(true)
      await fetchProfile()

      const response = await api.post(
        "/workout/generate",
        {},
        {
          headers: getAuthHeaders(),
        },
      )

      setWorkoutPlan(normalizeWorkoutPlan(response.data.workoutPlan))
    } catch (err) {
      try {
        await fetchExistingPlan()
        setError("")
      } catch {
        setError(err.response?.data?.message || "Unable to generate your plan. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const frequency = workoutPlan?.frequency || `${workoutPlan?.days?.length || 0} days per week`
  const formatSplit = (split) => {
    if (!split) {
      return "Custom split"
    }

    const splitParts = split.split("/").map((part) => part.trim()).filter(Boolean)

    if (
      splitParts.includes("Push") &&
      splitParts.includes("Pull") &&
      splitParts.includes("Legs") &&
      splitParts.includes("Upper") &&
      splitParts.includes("Lower")
    ) {
      return "Hybrid: Push/Pull/Legs + Upper/Lower"
    }

    if (splitParts.length > 3) {
      return `Hybrid: ${splitParts.slice(0, 3).join("/")} + ${splitParts.slice(3).join("/")}`
    }

    return splitParts.length > 0 ? splitParts.join(" / ") : split
  }
  const formatNumber = (value) => Number(value || 0).toLocaleString()
  const generatedAt = new Date().toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  })

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
            <p className="text-xl font-semibold">RepCoach AI</p>
          </div>

          <ProfileCard />
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        {(initialLoading || (loading && !workoutPlan)) && (
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_0_48px_rgba(132,255,36,0.12)] backdrop-blur-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400 text-gray-950 shadow-[0_0_32px_rgba(132,255,36,0.35)]">
              <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white">Building your training plan</h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-400">
              Generating your personalized weekly plan...
            </p>
          </div>
        )}

        {!initialLoading && !workoutPlan && error && (
          <div className="mx-auto max-w-xl rounded-2xl border border-red-400/20 bg-red-500/10 p-6 text-center">
            <p className="text-sm font-medium text-red-300">{error}</p>
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={loading}
              className="mt-4 cursor-pointer rounded-xl bg-lime-400 px-6 py-3 font-bold text-gray-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Try Again
            </button>
          </div>
        )}

        {workoutPlan && (
          <div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">Your Training Plan</h1>
                <p className="mt-2 text-sm font-medium text-zinc-400">
                  Version {workoutPlan.version || 1} • Created {generatedAt}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 font-semibold text-white transition hover:border-lime-400/50 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Regenerating..." : "Regenerate Plan"}
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                icon={<Target className="h-5 w-5" />}
                label="Goal"
                value={workoutPlan.goal || "Personalized training"}
              />
              <SummaryCard
                icon={<Calendar className="h-5 w-5" />}
                label="Frequency"
                value={frequency}
              />
              <SummaryCard
                icon={<Dumbbell className="h-5 w-5" />}
                label="Split"
                value={formatSplit(workoutPlan.split)}
              />
              <SummaryCard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Version"
                value={workoutPlan.version || 1}
              />
            </div>

            {profile && (
              <div className="mt-8">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime-400">
                      Diet & Macros
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">Nutrition Targets</h2>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Calculated from your profile and goal
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <NutritionCard
                    icon={<Activity className="h-5 w-5" />}
                    label="BMR"
                    value={formatNumber(profile.bmr)}
                    unit="kcal/day"
                  />
                  <NutritionCard
                    icon={<Flame className="h-5 w-5" />}
                    label="Maintenance"
                    value={formatNumber(profile.maintenance_calories)}
                    unit="kcal/day"
                  />
                  <NutritionCard
                    icon={<Target className="h-5 w-5" />}
                    label="Target Calories"
                    value={formatNumber(profile.target_calories)}
                    unit="kcal/day"
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(132,255,36,0.08)] backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-gray-950">
                      <Utensils className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Daily Macro Split</h3>
                      <p className="text-sm text-zinc-400">
                        Protein, carbs, and fats for your target calories.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 md:grid-cols-3">
                    <MacroBar
                      label="Protein"
                      value={profile.protein}
                      max={Math.max(profile.protein, profile.carbs, profile.fats)}
                      color="bg-lime-400"
                    />
                    <MacroBar
                      label="Carbs"
                      value={profile.carbs}
                      max={Math.max(profile.protein, profile.carbs, profile.fats)}
                      color="bg-cyan-400"
                    />
                    <MacroBar
                      label="Fats"
                      value={profile.fats}
                      max={Math.max(profile.protein, profile.carbs, profile.fats)}
                      color="bg-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(132,255,36,0.08)] backdrop-blur-md">
              <h2 className="text-xl font-bold text-white">Program Notes</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                {workoutPlan.program_notes ||
                  "Focus on clean technique, progressive overload, and stop any movement that aggravates an injury."}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold text-white">Weekly Schedule</h2>

              <div className="mt-5 space-y-5">
                {workoutPlan.days?.map((day) => (
                  <article
                    key={day.day}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(132,255,36,0.08)] backdrop-blur-md"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{day.day}</h3>
                        {day.focus && (
                          <p className="mt-1 font-semibold text-lime-400">{day.focus}</p>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-zinc-400">
                        {day.exercises?.length || 0} exercises
                      </p>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                      <table className="w-full min-w-[720px] border-collapse text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-zinc-500">
                            <th className="pb-3 font-bold">Exercise</th>
                            <th className="pb-3 font-bold">Sets x Reps</th>
                            <th className="pb-3 font-bold">Rest</th>
                            <th className="pb-3 font-bold">RPE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.exercises?.map((exercise, index) => (
                            <tr
                              key={`${day.day}-${exercise.exercise}`}
                              className="border-b border-white/10 last:border-0"
                            >
                              <td className="py-4 pr-6">
                                <div className="flex gap-4">
                                  <span className="mt-1 text-sm font-semibold text-zinc-500">
                                    {index + 1}.
                                  </span>
                                  <div>
                                    <p className="font-semibold text-zinc-100">{exercise.exercise}</p>
                                    {exercise.notes && (
                                      <p className="mt-1 text-sm text-zinc-500">{exercise.notes}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 pr-6 font-semibold text-zinc-200">
                                <span className="text-lime-400">{exercise.sets}</span> x {exercise.reps}
                              </td>
                              <td className="py-4 pr-6 text-zinc-400">{exercise.rest || "60-90 sec"}</td>
                              <td className="py-4">
                                <span className="rounded-lg bg-lime-400/10 px-3 py-2 font-bold text-lime-400">
                                  {exercise.rpe || 7}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-6 min-h-6" aria-live="polite">
              {loading && (
                <p className="rounded-xl border border-white/10 bg-[#070b11]/90 px-4 py-3 text-sm font-medium text-zinc-200">
                  Generating your personalized plan...
                </p>
              )}

              {error && (
                <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                  {error}
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_32px_rgba(132,255,36,0.08)] backdrop-blur-md">
      <div className="shrink-0 text-lime-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-500">{label}</p>
        <p className="mt-1 whitespace-normal font-bold leading-6 text-zinc-100">{value}</p>
      </div>
    </div>
  )
}

function NutritionCard({ icon, label, value, unit }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_32px_rgba(132,255,36,0.08)] backdrop-blur-md">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
        {icon}
      </div>
      <p className="text-sm font-semibold text-zinc-500">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="pb-1 text-sm font-medium text-zinc-400">{unit}</p>
      </div>
    </div>
  )
}

function MacroBar({ label, value, max, color }) {
  const width = `${Math.max(8, Math.round((Number(value || 0) / Number(max || 1)) * 100))}%`

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold text-zinc-200">{label}</p>
        <p className="font-bold text-white">{Number(value || 0)}g</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  )
}

export default Dashboard
