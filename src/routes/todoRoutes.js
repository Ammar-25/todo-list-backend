import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`);
  const todos = getTodos.all(req.userId);
  res.json(todos);
});

router.post("/", (req, res) => {
  const text = req.body.task;
  const userId = req.userId;

  try {
    const insertTodo = db.prepare(
      `INSERT INTO todos (user_id, task) VALUES (?, ?)`,
    );
    insertTodo.run(userId, text);
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

export default router;
