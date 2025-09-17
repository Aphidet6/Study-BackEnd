const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors"); // เอาไว้เรียกข้ามโดเมน

// สร้าง Express app
const app = express();
const port = 3000;

// Middleware เปรียบเหมือนกับยามที่ถาม Request ว่ามาทำอะไร
app.use(bodyParser.json());
app.use(cors()); // เปิดให้ทุกโดเมนผ่านได้หมด
app.use(express.static("public"));

// การเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mynewpassword",
  database: "ecommerce_db",
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// CRUD
// Create Read Update Delete

// Get All
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while retrieving products.",
        error: err,
      });
    } else {
      res.status(200).json(result);
    }
  });
});

// Create

app.post("/products", (req, res) => {
  const product = req.body;
  const sql =
    "INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      product.name,
      product.price,
      product.discount,
      product.review_count,
      product.image_url,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Error occurred while inserting product.",
          error: err,
        });
      } else {
        res.status(201).json({
          message: "Product created successfully.",
          id: result.insertId,
        });
      }
    }
  );
});

// Update
app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = req.body;
  const sql =
    "UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?";
  db.query(
    sql,
    [
      product.name,
      product.price,
      product.discount,
      product.review_count,
      product.image_url,
      id,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Error occurred while updating product.",
          error: err,
        });
      } else {
        res.status(200).json({ message: "Product updated successfully." });
      }
    }
  );
});

// Delete

app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while deleting product.",
        error: err,
      });
    } else {
      res.status(200).json({ message: "Product deleted successfully." });
    }
  });
});

// Read by keyword
app.get("/products/search/:keyword", (req, res) => {
  const keyword = req.params.keyword;
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, [`%${keyword}%`], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while searching products.",
        error: err,
      });
    } else {
      res.status(200).json(result);
    }
  });
});

// เริ่มต้น Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
