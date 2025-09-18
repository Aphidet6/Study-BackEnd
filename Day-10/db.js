const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '3256pass',
    database: 'auth_db'
});

const db = pool.promise();

module.exports = db;