import express from "express";
import { allUsers, userById, userPagination } from "./routs";

const app = express();

app.use(express.json());

app.get("/persons", allUsers);
app.get("/person/:id", userById);
app.get("/person/create", userPagination);

app.listen(5000, () => console.log("сервер запущен на 5000"));
