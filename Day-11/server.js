const express = require('express');
const bodyParser = require('body-parser');//Middleware เอาไว้ใช้ json ใน request body
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const users = []; // mockup user database

const SECRET_KEY = 'mysecret';
//สร้างฟังก์ชัน middleware สำหรับตรวจสอบ token
function authenticateToken(req, res, next) {//next() คือ function ที่จะเรียก middleware ตัวถัดไป
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token required' });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied : insufficient permissions' });
        }
        next();
    }
}

const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    //use ใช้ hash เพราะใช้งานเยอะ
    const hashedPassword = await bcrypt.hash(password, 10);
    //เก็บข้อมูล user ลง database mockup
    users.push({ username, password: hashedPassword, role: 'user' });
    console.log({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }//Authorization JWT
    const token = jwt.sign({ username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
});

app.post('/add-admin', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    //admin ใช้ hashSync ไม่ต้องรอเพราะใช้งานน้อย
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword, role: 'admin' });
    res.status(201).json({ message: 'Admin user created successfully' });
});

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.username} This is a protected route` });
});

app.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: `Hello, ${req.user.username} This is an admin route` });
});

app.get("/blog", authenticateToken, authorizeRoles('admin', 'user'), (req, res) => {
    res.json({ message: `Hello, ${req.user.username} This is a blog route` });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});