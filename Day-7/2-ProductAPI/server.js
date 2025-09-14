const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const port = 3000;

dotenv.config();

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.use(bodyParser.json());
app.use(cors());

// Get all products
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({
          message: "Error occurred while retrieving products.",
          error: err,
        });
    } else {
      res.status(200).json(result);
    }
  });
});

// Get product by id
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const sql = "SELECT * FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({
          message: "Error occurred while retrieving product.",
          error: err,
        });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Product not found." });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

// Create product
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
        res
          .status(500)
          .json({
            message: "Error occurred while inserting product.",
            error: err,
          });
      } else {
        res.status(201).json({ message: "Product inserted successfully." });
      }
    }
  );
});

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
        res
          .status(500)
          .json({
            message: "Error occurred while updating product.",
            error: err,
          });
      } else {
        res.status(200).json({ message: "Product updated successfully." });
      }
    }
  );
});

app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({
          message: "Error occurred while deleting product.",
          error: err,
        });
    } else {
      res.status(200).json({ message: "Product deleted successfully." });
    }
  });
});

//search products
app.get("/products/search/:keyword", (req, res) => {
  const keyword = req.params.keyword;
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, [`%${keyword}%`], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({
          message: "Error occurred while retrieving products.",
          error: err,
        });
    } else {
      res.status(200).json(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
