import express from 'express';
import { generatePlan, getWorkoutPlan } from '../controllers/workout.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', protectRoute, generatePlan);
router.get('/', protectRoute, getWorkoutPlan);

export default router;