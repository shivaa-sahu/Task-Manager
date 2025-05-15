const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;

  const task = new Task({
    title,
    description,
    dueDate,
    priority,
    assignedTo: assignedTo || req.user._id, // default to self if not provided
    createdBy: req.user._id,
  });

  await task.save();
  res.status(201).json({ message: "Task created successfully", task });
};

exports.getTasks = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const tasks = await Task.find({ assignedTo: req.user._id })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ dueDate: 1 })
    .populate("assignedTo", "name email");
  res.json(tasks);
};

exports.getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

exports.getCompletedTasks = async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find({
      assignedTo: req.user._id,
      status: "completed",
    })
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    res.status(500).json({ message: "Error fetching completed tasks" });
  }
};

exports.getTasksCreatedByUser = async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find({
      createdBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching created tasks:", error);
    res.status(500).json({ message: "Error fetching tasks created by user" });
  }
};

exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(task);
};
