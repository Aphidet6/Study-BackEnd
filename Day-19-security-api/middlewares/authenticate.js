const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access token is missing or invalid'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'invalid token'
            });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticate };