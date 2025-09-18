const express = require('express');
const bodyParser = require('body-parser');

const users = [];

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log("Hello World!");
    res.send('Hello World!');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    //เช็คว่ามี username นี้ในระบบหรือไม่
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
    }
    try {
        users.push({ username, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});