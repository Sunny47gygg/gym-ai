import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createProfile, getProfile, updateProfile } from "../controllers/profile.controller.js"

const router = express.Router()

router.post("/", protectRoute, createProfile)
router.get("/", protectRoute, getProfile)
router.put("/", protectRoute, updateProfile)

export default router