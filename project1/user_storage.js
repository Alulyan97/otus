const express = require("express");
const app = express();

const users = [
  {
    id: 1,
    name: "Ivan",
    age: 15,
  },
  {
    id: 2,
    name: "Irina",
    age: 18,
  },
];

app.get("/persons", (req, res) => {
  res.status(200);
  res.setHeader("Content-Type", "application/json");
  res.json(users);
});

app.get("/persons/:id", (req, res) => {
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

app.get("/persons/create", (req, res) => {
  const { id, name, age } = req.query;

  if (!id && !name && !age) {
    return res.status(400).json({ error: "Укажите параметры" });
  }

  for (const user of users) {
    const idOk = id && user.id == id;
    const nameOk = name && user.name == name;
    const ageOk = age && user.age == age;

    if (idOk || nameOk || ageOk) {
      return res.status(200).json(user);
    }
  }

  res.status(404).json({ error: "Пользователь не найден" });
});

app.listen(5000, console.log("сервер запущен на 5000"));
