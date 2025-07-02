import { Request, Response } from "express";
import Task from "../models/Task";

// Optional: If you've extended Express's Request type with a user object, this can be replaced with req.user.id
interface AuthRequest extends Request {
  user?: { id: string };
}

export const postTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, budget } = req.body;
    const task = new Task({ name, description, budget });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Post task error:", error);
    res.status(500).json({ message: "Failed to post task", error });
  }
};

export const listAvailableTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ claimedBy: null });
    res.json(tasks);
  } catch (error) {
    console.error("List tasks error:", error);
    res.status(500).json({ message: "Failed to list tasks", error });
  }
};

export const claimTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, claimedBy: null },
      { claimedBy: userId },
      { new: true }
    );

    if (!task) {
      res.status(400).json({ message: "Task already claimed or does not exist." });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error("Claim task error:", error);
    res.status(500).json({ message: "Failed to claim task", error });
  }
};

export const myTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const tasks = await Task.find({ claimedBy: userId });
    res.json(tasks);
  } catch (error) {
    console.error("Get my tasks error:", error);
    res.status(500).json({ message: "Failed to get your tasks", error });
  }
};

export const unclaimTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const task = await Task.findOne({ _id: id, claimedBy: userId });

    if (!task) {
      res.status(403).json({ message: "Not authorized to unclaim this task" });
      return;
    }

    task.claimedBy = null;
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Unclaim task error:", error);
    res.status(500).json({ message: "Failed to unclaim task", error });
  }
};
