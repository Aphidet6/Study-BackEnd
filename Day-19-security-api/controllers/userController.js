const pool = require('../config/db');
const logger = require('../untils/logger');

const getAllUsers = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT id, username, email FROM users');
        res.json(results);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE users SET username = ?, email = ? WHERE id = ?',
            [username, email, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error(error);
        next(error);
    }   
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };