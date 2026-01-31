import { users } from "./users";
import express from "express";
const app = express();

const allUsers = app.get("/persons", (req, res) => {
  res.status(200);
  res.setHeader("Content-Type", "application/json");
  res.json(users);
});

const userById = app.get("/person/:id", (req, res) => {
  const reqId = req.params.id;

  for (const user of users) {
    if (user.id.toString() === reqId) {
      res.status(200);
      res.setHeader("Content-Type", "application/json");
      res.json(user);
      return;
    }
  }

  res.status(404);
  res.setHeader("Content-Type", "application/json");
  res.json({ error: "Пользователь не найден" });
});

const userPagination = app.get("/person/create", (req, res) => {
  const { id, name, age } = req.query;

  for (const user of users) {
    const idOk = id && user.id.toString() == id;
    const nameOk = name && user.name == name;
    const ageOk = age && user.age.toString() == age;

    if (idOk || nameOk || ageOk) {
      return res.status(200).json(user);
    }
  }

  if (!id && !name && !age) {
    return res.status(400).json({ error: "Укажите параметры" });
  }

  res.status(404).json({ error: "Пользователь не найден" });
});

export { allUsers, userById, userPagination };
