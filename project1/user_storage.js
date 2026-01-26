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
    age: 15,
  },
];

app.get("/person", (req, res) => {
  res.status(200);
  res.setHeader("Content-Type", "application/json");
  res.json(users);
});

app.get("/person/:id", (req, res) => {
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

app.get("/person/create", (req, res) => {
  const id = req.query.id;
  const name = req.query.name;
  const age = req.query.age;

  res.status(200);
  res.setHeader("Content-Type", "application/json");

  res.json({
    id,
    name,
    age,
  });
});

app.listen(5000, console.log("сервер запущен на 5000"));
