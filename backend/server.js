import fs from 'fs';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import chalk from 'chalk';
import dayjs from 'dayjs';
import 'dayjs/locale/ka.js';
import joi from 'joi';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

dayjs.locale('ka');

dotenv.config();

const PORT = process.env.PORT || 5000;

const dataFilePath = path.join(__dirname, 'data/data.json');

console.log(dataFilePath);

const app = express();
app.use(cors());
app.use(express.json());

// Function to read data from the JSON file
function readDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    // If the file doesn't exist, create an empty array file
    fs.writeFileSync(dataFilePath, '[]', 'utf8');
    return '[]';
  } else {
    // If the file exists, read and return its content
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return data;
  }
}


// --------------Get All Todos---------------
app.get('/api/todos', (req, res) => {
    try {
        const data = readDataFile();
        const todos = JSON.parse(data);
        res.status(200).json(todos);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to read data' });
    }
})

// --------------Add New Todo---------------
app.post('/api/todos', (req, res) => {
   try {
    // Read and parse current todos
    const data = readDataFile();
    const todos = JSON.parse(data);

    // Validate input
    const schema = joi.object({
      title: joi.string().min(3).max(30).required(),
    });

    const { error } = schema.validate({ title: req.body.title });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create new todo
    const newTodo = {
      id: uuidv4(),
      title: req.body.title,
      completed: false,
      date: dayjs().format('DD.MM.YYYY, HH:mm'),
    };

    // Add to array
    todos.push(newTodo);

    // Save file synchronously 
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));

    // Respond to client
    res.status(201).json(newTodo);

  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
})

app.delete('/api/todos/:id', (req, res) => {
  try {
    // Read file synchronously
    const data = readDataFile();
    const todos = JSON.parse(data);

    // Find todo by ID
    const todoIndex = todos.findIndex(todo => todo.id === req.params.id);

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Remove the todo
    todos.splice(todoIndex, 1);

    // Write updated todos back to file synchronously
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));

    // Respond with 204 (No Content)
    res.status(204).send(); // 204 should not include a body
  } 
  catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.put('/api/todos/:id/toggle', (req, res) => {
  try {
    // Read todos from file
    const data = readDataFile();
    const todos = JSON.parse(data);

    // Find todo by ID
    const todo = todos.find(todo => todo.id === req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Toggle the completed state
    todo.completed = !todo.completed;

    // Write updated todos to file
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));

    // Respond with updated todo
    res.status(200).json(todo);
  } 
  catch (err) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});


// --------------Run Server---------------
app.listen(PORT, () => {
    console.log(chalk.blue(`localhost is running on port http://localhost:${PORT}`));
});
