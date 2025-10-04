const express = require('express');

const {
    registerUser,
    login,
    refreshToken,
    logout
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;