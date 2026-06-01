import { GoogleGenAI } from "@google/genai";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isHighDemandError = (error) => {
  const message = error?.message || ""
  return message.includes('"code":503') || message.includes("UNAVAILABLE")
}

export const generateWorkoutPlan = async (profile) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })

  const prompt = `
  Generate a personalized gym workout plan.

  User Details:

  Age: ${profile.age}
  Gender: ${profile.gender}
  Height: ${profile.height_cm} cm
  Weight: ${profile.weight_kg} kg

  Goal: ${profile.goal}
  Experience Level: ${profile.experience_level}
  Workout Days: ${profile.workout_days}

  Activity Level: ${profile.activity_level}
  Target Weight: ${profile.target_weight} kg
  Dietary Preferences: ${profile.dietary_preferences}
  Injuries: ${profile.injuries}

  Maintenance Calories: ${profile.maintenance_calories}
  Target Calories: ${profile.target_calories}

  Protein: ${profile.protein}g
  Carbs: ${profile.carbs}g
  Fat: ${profile.fats}g

  Please create a workout plan that includes exercises, sets, reps, rest periods, RPE, and short coaching notes. Focus on compound movements and ensure the plan is balanced across muscle groups. Provide a weekly schedule based on the user's workout days.

  Return ONLY valid JSON. Do not include markdown fences, explanations, comments, or extra text.
  Use this exact shape:

{
  "version": 1,
  "goal": "",
  "frequency": "",
  "split": "",
  "program_notes": "",
  "days": [
    {
      "day": "",
      "focus": "",
      "exercises": [
        {
          "exercise": "",
          "sets": 0,
          "reps": "",
          "rest": "",
          "rpe": 0,
          "notes": ""
        }
      ]
    }
  ]
}
  `;
  

  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      return response.text;
    } catch (error) {
      if (!isHighDemandError(error) || attempt === maxAttempts) {
        throw error
      }

      await sleep(attempt * 2000)
    }
  }

  throw new Error("Gemini is busy right now. Please try again in a minute.")
}
