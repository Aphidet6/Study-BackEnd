const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_POST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(bodyParser.json());

// GET all products
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while retrieving products",
        error: err,
      });
    } else {
      res.status(200).json(result);
    }
  });
});

// GET by id

app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const sql = "SELECT * FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while retrieving products",
        error: err,
      });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

app.listen(4000, () => {
  console.log("App listening on port 4000!");
});
