//ไฟล์นี้สำหรับกำหนดโครงสร้างของโมเดลผู้ใช้
const pool = require('../config/db');

class UserModel {
    static async getAllUsers() {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows;
    }
    static async getUserById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }
    static async updateUser(id, data) {
        const { name, email } = data;
        const [result] = await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        return result.affectedRows > 0;
    }
    static async deleteUser(id) {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
module.exports = UserModel;