const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./db');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/auth');

const SECRET_KEY = 'jwt_secret';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log("Hello World!");    
    res.send('Hello World!');
});

app.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: `Hello ${req.user.username}!` });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    //เช็คว่ามี username นี้ในระบบหรือไม่
    try {
        const [existingUser] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        //เข้ารหัส password
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (username, hashedpassword) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        //ค้นหา user ในฐานข้อมูล
        const [row] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (row.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = row[0];
        //ตรวจสอบ password
        const isPasswordValid = await bcrypt.compare(password, user.hashedpassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        //สร้าง JWT
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});