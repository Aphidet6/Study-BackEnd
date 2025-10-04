const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = require('./env');
const logger = require('../untils/logger');
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await pool.getConnection();
        logger.info('Database connected successfully');
        connection.release();
    } catch (error) {
        // pass structured info to winston (message + meta)
        logger.error('Database connection failed', { error: error });
    }

})();

module.exports = pool;