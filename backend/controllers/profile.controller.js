import { pool } from '../db/db.js'

const calculateBMR = (gender, weight_kg, height_cm, age) => {
  if (gender.toLowerCase() === "male") {
    return (
      Math.round(10 * weight_kg + 6.25 * height_cm - 5 * age + 5)
    );
  }
  else {
    return (
      Math.round(10 * weight_kg + 6.25 * height_cm - 5 * age - 161)
    );
  }
}

const calculateMaintenanceCalories = (bmr, activity_level) => {
  switch (activity_level) {
    case "Sedentary":
      return Math.round(bmr * 1.2);

    case "Lightly Active":
      return Math.round(bmr * 1.375);

    case "Moderately Active":
      return Math.round(bmr * 1.55);

    case "Very Active":
      return Math.round(bmr * 1.725);

    default:
      return Math.round(bmr * 1.2);
  }
}

const calculateTargetCalories = (maintenanceCalories, goal) => {
  switch (goal) {
    case "Fat Loss":
      return Math.round(maintenanceCalories - 500);

    case "Maintain":
      return maintenanceCalories;

    case "Lean Bulk":
      return Math.round(maintenanceCalories + 300);

    case "Muscle Bulk":
      return Math.round(maintenanceCalories + 500);

    default:
      return maintenanceCalories;
  }
}

const calculateMacros = (weight_kg, targetCalories) => {
  const protein = Math.round(weight_kg * 2);
  const fat = Math.round(weight_kg * 0.8);
  const carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);

  return { protein, fat, carbs };
};

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const { age, gender, height_cm,
      weight_kg, activity_level, goal, target_weight,
      experience_level, injuries, workout_days, dietary_preferences
      } = req.body

    const bmr = calculateBMR(gender, weight_kg, height_cm, age)
    const maintenanceCalories = calculateMaintenanceCalories(bmr, activity_level)
    const targetCalories = calculateTargetCalories(maintenanceCalories, goal)
    const macros = calculateMacros(weight_kg, targetCalories)

    const newProfile = await pool.query(
      `INSERT INTO user_profiles (user_id, age, gender, height_cm, weight_kg, activity_level, goal, target_weight, experience_level, injuries, workout_days, dietary_preferences, bmr, maintenance_calories, target_calories, protein, fats, carbs)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (user_id) DO UPDATE SET
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        height_cm = EXCLUDED.height_cm,
        weight_kg = EXCLUDED.weight_kg,
        activity_level = EXCLUDED.activity_level,
        goal = EXCLUDED.goal,
        target_weight = EXCLUDED.target_weight,
        experience_level = EXCLUDED.experience_level,
        injuries = EXCLUDED.injuries,
        workout_days = EXCLUDED.workout_days,
        dietary_preferences = EXCLUDED.dietary_preferences,
        bmr = EXCLUDED.bmr,
        maintenance_calories = EXCLUDED.maintenance_calories,
        target_calories = EXCLUDED.target_calories,
        protein = EXCLUDED.protein,
        fats = EXCLUDED.fats,
        carbs = EXCLUDED.carbs
      RETURNING *`,
      [userId, age, gender, height_cm, weight_kg, activity_level, goal, target_weight, experience_level, injuries, workout_days, dietary_preferences, bmr, maintenanceCalories, targetCalories,
        macros.protein, macros.fat,
        macros.carbs]
    );

    res.status(200).json({ message: "Profile created successfully", profile: newProfile.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const profile = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId])

    if (profile.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" })
    }

    res.status(200).json({ profile: profile.rows[0] })
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { age, gender, height_cm,
      weight_kg, activity_level, goal, target_weight,
      experience_level, injuries, workout_days, dietary_preferences
      } = req.body

    const bmr = calculateBMR(gender, weight_kg, height_cm, age)
    const maintenanceCalories = calculateMaintenanceCalories(bmr, activity_level)
    const targetCalories = calculateTargetCalories(maintenanceCalories, goal)
    const macros = calculateMacros(weight_kg, targetCalories)

    const updatedProfile = await pool.query(
      'UPDATE user_profiles SET age = $1, gender = $2, height_cm = $3, weight_kg = $4, activity_level = $5, goal = $6, target_weight = $7, experience_level = $8, injuries = $9, workout_days = $10, dietary_preferences = $11, bmr = $12, maintenance_calories = $13, target_calories = $14, protein = $15, fats = $16, carbs = $17 WHERE user_id = $18 RETURNING *',
      [age, gender, height_cm, weight_kg, activity_level, goal, target_weight, experience_level, injuries, workout_days, dietary_preferences, bmr, maintenanceCalories, targetCalories,
        macros.protein, macros.fat,
        macros.carbs, userId]
    );

    if (updatedProfile.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" })
    }

    res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
