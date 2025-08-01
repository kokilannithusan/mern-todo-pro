// Express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// create an instance od express
const app = express();
app.use(express.json()); // it will get the request from the browser as json data
app.use(cors());

// sample in-memory storage for todo items
// let todos = [];

// Connecting mongoodb
mongoose
  .connect("mongodb://localhost:27017/mern-app")
  .then(() => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

//creating schema
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
});

// Creating Model
const todoModel = mongoose.model("Todo", todoSchema);

// creat a new todo
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo); //response status code and send the newTodo data as json
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
// Get data from db
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// Update todo item
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;

    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Dete a todo item
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// start the server
const port = 8000;
app.listen(port, () => {
  console.log("Server is listening to port " + port);
});
