const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = require('../config/env');
const logger = require('../utils/logger');

let refreshToken = [];

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email and password are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        logger.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//login a user
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!results.length) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const accessToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ email: user.email }, REFRESH_TOKEN_SECRET);
        refreshToken.push(refreshToken);
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        logger.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};