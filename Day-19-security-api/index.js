require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./untils/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const { apiLimiter, loginLimiter } = require('./middlewares/rateLimiter');

//Import routes
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// ใช้ rate limiter กับทุกเส้นทางที่ขึ้นต้นด้วย /api/
app.use("/api", apiLimiter);

// ใช้ rate limiter เฉพาะกับเส้นทาง /api/auth/login
app.use("/api/auth/login", loginLimiter);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    if (typeof logger.info === 'function') {
        logger.info(`Server is running on port ${PORT}`);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});