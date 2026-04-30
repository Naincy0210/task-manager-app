import { Request, Response } from "express";
import Project from "../models/Project.ts";

export const createProject = async (req: any, res: Response) => {
  try {
    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      admin: req.user.userId,
      members: [req.user.userId]
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addMember = async (req: any, res: Response) => {
  try {
    const { projectId, userId } = req.body;
    const project: any = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.admin.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjects = async (req: any, res: Response) => {
  try {
    const projects = await Project.find({ members: req.user.userId })
      .populate("admin", "name email")
      .populate("members", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
