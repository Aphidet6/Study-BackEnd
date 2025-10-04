require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./utils/logger');
const { PORT } = require('./config/env');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    logger.log(`Server is running on port ${PORT}`);
});