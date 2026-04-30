import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Models, Routes, etc. will be imported here
import authRoutes from "./server/routes/authRoutes.ts";
import taskRoutes from "./server/routes/taskRoutes.ts";
import projectRoutes from "./server/routes/projectRoutes.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    mongoose
      .connect(MONGODB_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } else {
    console.warn("MONGODB_URI not found in environment variables. Database features will not work.");
  }

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Logging and DB check
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    if (mongoose.connection.readyState !== 1 && req.path.startsWith("/api") && req.path !== "/api/health") {
      return res.status(503).json({ message: "Database not connected. Please check MONGODB_URI in secrets." });
    }
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Team Task Manager API is running" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/projects", projectRoutes);

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
