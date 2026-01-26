const express = require("express");
const path = require("path");
const app = express();

app.get("/person", (req, res) => {
  res.send({ name: "Ivan" });
});

app.get("/file", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/status", (req, res) => {
  res.sendStatus(204);
});

app.listen(8080, () => console.log("name person localhost 8080"));
