import fs from 'fs';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import chalk from 'chalk';

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

// --------------Run Server---------------
app.listen(PORT, () => {
    console.log(chalk.blue(`localhost is running on port http://localhost:${PORT}`));
});
