import { signup, Login } from "../controllers/auth.controller.js"
import express from "express"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", Login)

export default router