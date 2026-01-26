const express = require("express");
const app = express();

app.get(/^\/hel+o\/([^\/]+)$/, (req, res) => {
  res.send("сработал роут hel+o");
});

app.get(/^\/hell?o\/([^\/]+)$/, (req, res) => {
  res.send("сработал роут hell?o");
});

app.get(/^\/hello\/([^\/]+)$/, (req, res) => {
  res.send("сработал роут hello");
});

// app.get(/^\//.*/\/([^\/]+)$/, (req, res) => {
//   res.send("сработал роут hello");
// });

app.listen(3030, () => console.log("Сервер запущен на порту 3030"));
