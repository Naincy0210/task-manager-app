import express from "express";
import { register, login, getMe, logout, getUsers } from "../controllers/authController.ts";
import { auth } from "../middleware/auth.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.get("/users", auth, getUsers);
router.post("/logout", logout);

export default router;
