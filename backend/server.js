import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { pool } from "./db/db.js"
import authRoutes from "./routes/auth.routes.js"
import profileRoutes from "./routes/profile.routes.js"  
import workoutRoutes from "./routes/workout.route.js"
import { protectRoute } from "./middleware/auth.middleware.js"

//configure .env
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

//Middleware 
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/workout", workoutRoutes)

app.get(
  "/api/protected",
  protectRoute,
  (req, res) => {
    res.json({
      message: "You are authenticated",
      user: req.user
    });
  }
);

app.get("/", (req, res) => {
  res.send("API is running")
})

const tryDB = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log( result.rows[0]);
  } catch (err) {
    console.error(err);
  }
}

tryDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})