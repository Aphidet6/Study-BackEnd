const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = require('../config/env');
const logger = require('../untils/logger');

// In-memory store for refresh tokens (for demo purposes). In production use persistent store.
let refreshTokens = [];

const registerUser = async (req, res) => {
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

// login a user
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
        const newRefreshToken = jwt.sign({ id: user.id, username: user.username }, REFRESH_TOKEN_SECRET);
        // store refresh token (demo only)
        refreshTokens.push(newRefreshToken);

        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        logger.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// issue a new access token using a refresh token
const refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });
    if (!refreshTokens.includes(token)) return res.status(403).json({ message: 'Invalid refresh token' });

    try {
        const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
        // create new access token
        const accessToken = jwt.sign({ id: payload.id, username: payload.username }, JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    } catch (error) {
        logger.error('Error refreshing token:', error);
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};

// logout: remove refresh token
const logout = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Refresh token required' });
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.json({ message: 'Logged out successfully' });
};

module.exports = {
    registerUser,
    login,
    refreshToken,
    logout
};