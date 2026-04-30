import express from "express";
import { createTask, updateTaskStatus, getTasks, getDashboardStats } from "../controllers/taskController.ts";
import { auth, checkRole } from "../middleware/auth.ts";

const router = express.Router();

router.use(auth);
router.post("/", checkRole(["admin"]), createTask);
router.patch("/:id", updateTaskStatus);
router.get("/", getTasks);
router.get("/stats", getDashboardStats);

export default router;
