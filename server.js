import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import User from "./users.js";
import Todos from "./todos.js";

// App Config
const app = express();
const port = process.env.PORT || 8001;
const connection_url = 'mongodb+srv://admin:zN2yWWN2b94mlWGm@cluster0.asois.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// Middlewares
app.use(cors());
app.use(express.json());

// DB config
mongoose.connect(connection_url, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

// API Endpoints
app.get("/", (req, res) => res.status(200).send("Hello World!"));

app.post("/register", async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({ username }).exec();
  if (user) {
    res.status(500);
    res.json({
      message: "user already exists",
    });
    return;
  }
  await User.create({ username, password });
  res.send({
    message: "success",
  });
});

app.post("/login", async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "user does not exist",
    });
    return;
  }
  await User.create({ username, password });
  res.send({
    message: "success",
  });
});

app.post("/todos", async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(" ");
  const [username, password] = token.split(":");
  const todosItems = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "user does not exist",
    });
    return;
  }
  const todos = await Todos.findOne({ userId: user._id }).exec();
  if (!todos) {
    await Todos.create({
      userId: user._id,
      todos: todosItems,
    })
  } else {
    todos.todos = todosItems;
    await todos.save();
  }
  res.json(todosItems);
});

app.get("/todos", async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(" ");
  const [username, password] = token.split(":");
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "user does not exist",
    });
    return;
  }
  const { todos } = await Todos.findOne({ userId: user._id }).exec();
  res.json(todos);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(port, () => {
    console.log(`listening on localhost: ${port}`)
  });
});