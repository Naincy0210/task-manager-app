import express from "express";
import { createProject, addMember, getProjects } from "../controllers/projectController.ts";
import { auth, checkRole } from "../middleware/auth.ts";

const router = express.Router();

router.use(auth);
router.post("/", checkRole(["admin"]), createProject);
router.post("/add-member", checkRole(["admin"]), addMember);
router.get("/", getProjects);

export default router;
