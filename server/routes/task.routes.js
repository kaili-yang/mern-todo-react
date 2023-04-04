const express = require("express");
const router = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

const {
  getTask,
  addTask,
  updateTask,
  deleteTasks,
} = require("../controllers/tasks.controllers");

console.log("router");
// Render all tasks
router.get("/", getTask);

router.post("/task/add", addTask);

router.post("/task/:id/edit", updateTask);

router.delete("/task/delete/:id", deleteTasks);

module.exports = router;