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

router.put("/:id", (req, res) => {
  const todo = req.body;
  const sql = db.prepare(
    `UPDATE todos SET task = ?, completed = ? WHERE id = ?`,
  );
  try {
    sql.run(todo.task, todo.completed, req.params.id);
    return res.status(200).json({ message: "Todo updated" });
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(503);
  }
});

router.delete("/:id", async (req, res) => {
  const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ?`);
  try {
    await deleteTodo.run(req.params.id);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500);
  }
});

export default router;
