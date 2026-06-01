import { pool } from '../db/db.js';
import { generateWorkoutPlan } from '../services/gemini.service.js';

const parseWorkoutPlan = (plan) => {
  const cleanedPlan = plan
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const jsonStart = cleanedPlan.indexOf("{");
  const jsonEnd = cleanedPlan.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Gemini did not return JSON")
  }

  return JSON.parse(cleanedPlan.slice(jsonStart, jsonEnd + 1));
}

const getGeneratePlanErrorMessage = (error) => {
  const message = error?.message || ""

  if (message.includes('"code":503') || message.includes("UNAVAILABLE")) {
    return "Gemini is busy right now. Please try again in a minute."
  }

  return message || "Failed to generate workout plan"
}

export const generatePlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const profileResult = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1', [userId]);

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const profile = profileResult.rows[0];

    const plan = await generateWorkoutPlan(profile);

    const workoutPlan = parseWorkoutPlan(plan);

    const planForStorage = JSON.stringify(workoutPlan);

    const existingPlan = await pool.query(
      'SELECT user_id FROM workout_plans WHERE user_id = $1',
      [userId]
    );

    if (existingPlan.rows.length > 0) {
      await pool.query(
        `UPDATE workout_plans
        SET plan_data = $1
        WHERE user_id = $2`,
        [planForStorage, userId]
      );
    } else {
      await pool.query(
        'INSERT INTO workout_plans (user_id, plan_data) VALUES ($1, $2)',
        [userId, planForStorage]
      );
    }

    res.status(200).json({ workoutPlan });
  }
  catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({
      message: getGeneratePlanErrorMessage(error)
    });
  }
}

export const getWorkoutPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const plan = await pool.query(
      'SELECT * FROM workout_plans WHERE user_id = $1', [userId]);

    if (plan.rows.length === 0) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    
    res.status(200).json({ workoutPlan: plan.rows[0] });
  }
  catch (error) {
    console.error('Error fetching workout plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
