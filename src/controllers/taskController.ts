import { Request, Response } from "express";

// Simulate a Task model (in-memory)
interface Task {
  id: string;
  name: string;
  description: string;
  budget: number;
  claimedBy: string | null;
}

let mockTasks: Task[] = []; // In-memory tasks

// Auto-increment ID for tasks
let taskIdCounter = 1;

// Post new task
export const postTask = async (req: Request, res: Response): Promise<void> => {
  const { name, description, budget } = req.body;

  const task: Task = {
    id: String(taskIdCounter++),
    name,
    description,
    budget: Number(budget),
    claimedBy: null,
  };

  mockTasks.push(task);
  res.status(201).json(task);
};

// List tasks that aren't claimed
export const listAvailableTasks = async (_req: Request, res: Response): Promise<void> => {
  const available = mockTasks.filter((task) => task.claimedBy === null);
  res.json(available);
};

// Claim a task
export const claimTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  const task = mockTasks.find((t) => t.id === id && t.claimedBy === null);

  if (!task) {
    res.status(400).json({ message: "Task already claimed or does not exist" });
    return;
  }

  task.claimedBy = userId;
  res.json(task);
};

// View your claimed tasks
export const myTasks = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;
  const claimed = mockTasks.filter((t) => t.claimedBy === userId);
  res.json(claimed);
};

// Unclaim a task
export const unclaimTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  const task = mockTasks.find((t) => t.id === id);

  if (!task || task.claimedBy !== userId) {
    res.status(403).json({ message: "Not authorized to unclaim this task" });
    return;
  }

  task.claimedBy = null;
  res.json(task);
};
