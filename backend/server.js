import fs from 'fs';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import chalk from 'chalk';
import dayjs from 'dayjs';
import 'dayjs/locale/ka.js';
import joi from 'joi';

dayjs.locale('ka');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const dataFilePath = path.join('data/data.json');

// --------------Get All Todos---------------
app.get('/api/todos', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(chalk.red('Failed to read data'));
            return res.status(500).json({ error: 'Failed to read data' });
        }
        console.log(chalk.green(data));
        const todos = JSON.parse(data);
        res.status(200).json(todos);
    })
})

// --------------Add New Todo---------------
app.post('/api/todos', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.log(chalk.red('Failed to read data'));
            return res.status(500).json({ error: 'Failed to read data' });
        }

        const date = dayjs()

        const todos = JSON.parse(data)

        const schema = joi.object({
            title: joi.string().min(3).max(30).required()
        })

        const { error } = schema.validate({ title: req.body.title })
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const newTodo = {
            id: uuidv4(),
            title: req.body.title,
            completed: false,
            date: date.format('DD.MM.YYYY, HH:mm')
        }

        todos.push(newTodo)
        await fs.writeFile(dataFilePath, JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.log(chalk.red('Failed to write data'));
                return res.status(500).json({ error: 'Failed to write data' });
            }
        })
        console.log(chalk.green('New Todo Successfully Added'));
        res.status(201).json(newTodo);
        
    })
})

app.delete('/api/todos/:id', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.log(chalk.red('Failed to read data'));
            return res.status(500).json({ error: 'Failed to read data' });
        }           

        const todos = JSON.parse(data);
        const todoIndex = todos.findIndex(todo => todo.id === req.params.id);

        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todos.splice(todoIndex, 1);

        await fs.writeFile(dataFilePath, JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.log(chalk.red('Failed to write data'));
                return res.status(500).json({ error: 'Failed to write data' });
            }
        });

        console.log(chalk.green('Todo Successfully Deleted'));
        res.status(204).send();
    });
});

app.put('/api/todos/:id/toggle', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.log(chalk.red('Failed to read data'));
            return res.status(500).json({ error: 'Failed to read data' });
        }
        const todos = JSON.parse(data);
        const todo = todos.find(todo => todo.id === req.params.id);

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todo.completed = !todo.completed;

        await fs.writeFile(dataFilePath, JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.log(chalk.red('Failed to write data'));
                return res.status(500).json({ error: 'Failed to write data' });
            }
        });

        console.log(chalk.green('Todo Successfully Toggled'));
        res.status(200).json(todo);
    });
});

// --------------Run Server---------------
app.listen(PORT, () => {
    console.log(chalk.blue(`localhost is running on port http://localhost:${PORT}`));
});
