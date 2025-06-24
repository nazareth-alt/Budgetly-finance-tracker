const asyncHandler = require("express-async-handler");
const Goal = require("../model/Goal");

exports.createGoal = asyncHandler(async (req, res) => {
  const { title, targetAmount, currentAmount, deadline } = req.body;
  const goal = await Goal.create({
    user: req.user._id,
    title,
    targetAmount,
    currentAmount,
    deadline,
  });
  res.status(201).json(goal);
});

exports.getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(goals);
});

exports.updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) throw new Error("Goal not found");
  Object.assign(goal, req.body);
  const updated = await goal.save();
  res.json(updated);
});

exports.deleteGoal = asyncHandler(async (req, res) => {
  const deleted = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deleted) throw new Error("Goal not found or unauthorized");
  res.json({ message: "Goal deleted" });
});
