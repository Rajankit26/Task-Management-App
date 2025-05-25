import {Router} from "express"
import { protect } from "../middlewares/authMiddleware.js"
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/authController.js"
const router = Router()

// Auth Routes
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)

export default router;