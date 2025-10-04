const jwt = require('jsonwebtoken');
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = process.env;

class TokenService {
    static generateToken(user) {
        return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    }
    static generateRefreshToken(user) {
        return jwt.sign({ id: user.id, username: user.username }, REFRESH_TOKEN_SECRET);
    }
    static verifyToken(token) {
        return jwt.verify(token, secret);
    }
}

module.exports = TokenService;