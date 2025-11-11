import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from 'chalk';
import dayjs from 'dayjs';
import 'dayjs/locale/ka.js';
import joi from 'joi';
import mongoose from 'mongoose';



dayjs.locale('ka');
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI



const app = express();
app.use(cors());
app.use(express.json());


// --------------Connect to MongoDB---------------
mongoose.connect(MONGODB_URI,)
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// ვქმნით სქემას, რომელიც განსაზღვრავს Todo ობიექტის სტრუქტურას
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    date: { type: String }
}, { timestamps: true });


// ვაგებთ მოდელს სქემის საფუძველზე, რომელსაც ახალი ობიექტის შექმნისას გამოგვიყენებთ
const Todo = mongoose.model("Todo", todoSchema);


// --------------Get All Todos---------------
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }); // ბოლოები ზემოთ
    res.status(200).json(todos);
    console.log(chalk.green(`Fetched ${todos.length} todos from MongoDB`));
  } catch (err) {
    console.log(chalk.red('Failed to fetch todos from MongoDB'), err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// --------------Add New Todo---------------
app.post('/api/todos', async (req, res) => {
  try {
    const date = dayjs();
    
    // Joi ვალიდაცია
    const schema = joi.object({
      title: joi.string().min(3).max(30).required(),
    });

    const { error } = schema.validate({ title: req.body.title });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ახალი Todo ობიექტის შექმნა MongoDB-სთვის
    const newTodo = new Todo({
      title: req.body.title,
      completed: false,
      date: date.format('DD.MM.YYYY, HH:mm'),
    });

    //  MongoDB-ში შენახვა
    const savedTodo = await newTodo.save();

    console.log(chalk.green('New Todo Successfully Added'));
    res.status(201).json(savedTodo);
  } catch (err) {
    console.log(chalk.red('Failed to add new todo'), err);
    res.status(500).json({ error: 'Server error while adding todo' });
  }
});

// --------------Delete Todo---------------
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      console.log(chalk.yellow(`Todo not found with id: ${id}`));
      return res.status(404).json({ error: 'Todo not found' });
    }

    console.log(chalk.green(`Todo successfully deleted: ${deletedTodo.title}`));
    res.status(204).send(); // 204 = no content
  } catch (err) {
    console.log(chalk.red('Failed to delete todo from MongoDB'), err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// --------------Toggle Todo completed---------------
app.put('/api/todos/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    // მოძებნე Todo MongoDB-ში
    const todo = await Todo.findById(id);

    if (!todo) {
      console.log(chalk.yellow(`Todo not found with id: ${id}`));
      return res.status(404).json({ error: 'Todo not found' });
    }

    // toggle completed მნიშვნელობა
    todo.completed = !todo.completed;
    await todo.save();

    console.log(chalk.green(`Todo successfully toggled: "${todo.title}" → ${todo.completed ? '✅ Completed' : '❌ Not Completed'}`));

    res.status(200).json(todo);
  } catch (err) {
    console.log(chalk.red('Failed to toggle todo in MongoDB'), err);
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});


// --------------Run Server---------------
app.listen(PORT, () => {
    console.log(chalk.blue(`localhost is running on port http://localhost:${PORT}`));
});
