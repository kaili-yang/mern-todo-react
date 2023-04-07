const express = require("express");
const taskRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
// const Record = require('../models/record');

function makeModel(req) {
  const taskSchema = {
    content: req.body.content,
    status: req.body.status,
    description: req.body.description,
  };
  return taskSchema
}
// // This section will help you get a list of all the tasks.
taskRoutes.route("/api/task").get(function (req, res) {
  let db_connect = dbo.getDb();
  let query = {};
  if (req.query.content) {
    query = { content: { $regex: req.query.content} };
  }
  db_connect
      .collection("tasks")
      .find(query)
      .sort({ status: 1 })
      .toArray(function (err, result) {
        handleResult(res, err, result)
      });
});

// This section will help you create a new task.
taskRoutes.route("/api/task/add").post(function (req, res) {
  let db_connect = dbo.getDb();
  const myobj = makeModel(req);
  db_connect.collection("tasks").insertOne(myobj, function (err, result) {
    handleResult(res, err, result)
  });
});

// This section will help you update a task by id.
taskRoutes.route("/api/task/update").post(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.body._id) };
  let newvalues = {
    $set: {
      content: req.body.content,
      status: req.body.status,
      description: req.body.description,
    },
  };
  db_connect
    .collection("tasks")
    .updateOne(myquery, newvalues, function (err, result) {
      handleResult(res, err, result)
    });
});

// This section will help you delete all tasks
taskRoutes.route("/api/task/delete/:id?").delete((req, res) => {
  let db_connect = dbo.getDb();
  let myquery = req.params.id ? { _id: ObjectId(req.params.id) } : {};
  db_connect.collection("tasks").deleteMany(myquery, function (err, result) {
    handleResult(res, err, result)
  });
});



function handleResult(res, err, result){
  if (err) return res.send({data: null, msg: "No tasks found."});
  if (!result || result.length === 0) return res.send({data: null, msg: "No tasks found."});
  res.json({ data: result, msg: "success" });
};
module.exports = taskRoutes;