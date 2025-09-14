const express = require("express"); // เรียกใช้ Express
const bodyParser = require("body-parser"); // เรียกใช้ body-parser สำหรับรับข้อมูลจาก HTTP POST
const cors = require("cors"); // เรียกใช้ cors สำหรับการทำ Cross-Origin Resource Sharing (CORS)
const mysql = require("mysql2"); // เรียกใช้ mysql2 สำหรับเชื่อมต่อฐานข้อมูล MySQL

const app = express();
const port = 3000;

const db = mysql.createConnection({
  // กำหนดการเชื่อมต่อฐานข้อมูล MySQL
  host: "localhost",
  user: "root",
  password: "mynewpassword",
  database: "technical_terms",
});

db.connect((err) => {
  // เชื่อมต่อฐานข้อมูล MySQL โดยใช้คำสั่ง connect
  if (err) {
    // ถ้าเกิดข้อผิดพลาด
    throw err; // ให้แสดงข้อผิดพลาด
  }
  console.log("MySQL connected...");
});

app.use(cors()); // ใช้ cors สำหรับการทำ Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // ใช้ body-parser สำหรับรับข้อมูลจาก HTTP POST

app.post("/api/terms", (req, res) => {
  const { term, definition } = req.body; // รับข้อมูลจาก HTTP POST ที่ส่งมาจาก extension/popup.js
  const sql = "INSERT INTO terms (term, definition) VALUES (?, ?)"; // กำหนดคำสั่ง SQL สำหรับเพิ่มข้อมูลลงในตาราง terms
  db.query(sql, [term, definition], (err, result) => {
    // สั่ง Query คำสั่ง SQL และส่งข้อมูล term และ definition ไปด้วย
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json({ id: result.insertId, term, definition });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
