const jwt = require('jsonwebtoken');

const SECRET_KEY = 'jwt_secret';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message : "Access denied" });
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;