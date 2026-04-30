import { Request, Response } from "express";
import Task from "../models/Task.ts";

export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description, status, dueDate, assignee, projectId } = req.body;
    const task = new Task({
      title,
      description,
      status,
      dueDate,
      assignee,
      project: projectId,
      createdBy: req.user.userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTaskStatus = async (req: any, res: Response) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTasks = async (req: any, res: Response) => {
  try {
    const { projectId } = req.query;
    const query: any = {};
    if (projectId) query.project = projectId;
    else {
      // If no project specified, get tasks where user is assignee or creator
      query.$or = [{ assignee: req.user.userId }, { createdBy: req.user.userId }];
    }

    const tasks = await Task.find(query)
      .populate("assignee", "name")
      .populate("project", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const tasks = await Task.find({
      $or: [{ assignee: userId }, { createdBy: userId }]
    });

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === "done").length,
      pending: tasks.filter(t => t.status === "pending").length,
      inProgress: tasks.filter(t => t.status === "in-progress").length,
      overdue: tasks.filter(t => t.status !== "done" && t.dueDate && new Date(t.dueDate) < new Date()).length
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
