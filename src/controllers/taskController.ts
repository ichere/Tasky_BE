import Task from "../models/Task";

export const postTask = async (req, res) => {
  const { name, description, budget } = req.body;
  const task = new Task({ name, description, budget });
  await task.save();
  res.status(201).json(task);
};

export const listAvailableTasks = async (req, res) => {
  const tasks = await Task.find({ claimedBy: null });
  res.json(tasks);
};

export const claimTask = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: id, claimedBy: null },
    { claimedBy: user.id },
    { new: true }
  );

  if (!task) {
    return res.status(400).json({ message: "Task already claimed." });
  }

  res.json(task);
};

export const myTasks = async (req, res) => {
  const { user } = req.body;
  const tasks = await Task.find({ claimedBy: user.id });
  res.json(tasks);
};

export const unclaimTask = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  const task = await Task.findOne({ _id: id, claimedBy: user.id });
  if (!task) return res.status(403).json({ message: "Unauthorized" });

  task.claimedBy = null;
  await task.save();
  res.json(task);
};
