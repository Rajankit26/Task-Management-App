import Router from "express"
import { protect, adminOnly } from "../middlewares/authMiddleware.js"

const router = Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReports); //Export all tasks as Excel/pdf
router.get("/export/users", protect, adminOnly, exportUserReports); //Export user-task-report

export default router;
