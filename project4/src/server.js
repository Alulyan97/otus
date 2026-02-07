const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Word");
});

app.get("/hello", (req, res) => {
  res.send("Hello " + req.query.name);
});

app.get("/hello/:id", (req, res) => {
  res.send("Hello " + req.params.id);
});

app.listen(8081, () => console.log("Hello from 8081"));
