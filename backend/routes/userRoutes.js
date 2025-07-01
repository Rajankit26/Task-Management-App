import {Router} from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { getUsers, getUserById } from "../controllers/userController.js";

const router = Router()


// User management routes
router.get("/", protect, adminOnly, getUsers) //Get all users(Admin only)
router.get("/:id", protect, getUserById) //Get a specipic user

// router.delete("/:id", protect, adimOnly, deleteUser) // Delete user (Admin only)

export default router;