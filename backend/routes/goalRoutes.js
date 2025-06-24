const express = require("express");
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, createGoal)
  .get(isAuthenticated, getGoals);

router
  .route("/:id")
  .put(isAuthenticated, updateGoal)
  .delete(isAuthenticated, deleteGoal);

module.exports = router;
