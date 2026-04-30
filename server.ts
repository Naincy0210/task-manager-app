import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import projectRoutes from "./routes/projectRoutes";

async function startServer() {
const app = express();
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
mongoose
.connect(MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));
} else {
console.warn("MONGODB_URI not found");
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

if (process.env.NODE_ENV !== "production") {
const vite = await createViteServer({
server: { middlewareMode: true },
appType: "spa",
});
app.use(vite.middlewares);
} else {
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
res.sendFile(path.join(distPath, "index.html"));
});
}

app.listen(PORT, "0.0.0.0", () => {
console.log(`Server running on port ${PORT}`);
});
}

startServer();
