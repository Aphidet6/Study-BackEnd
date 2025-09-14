//เฉลยการบ้านไม่ได้ต่อ DB แต่ใช้ Array แทน
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const products = [];

// POST สำหรับ Create
app.post("/products", (req, res) => {
  products.push(req.body);
  res.json(products);
});

// GET สำหรับ Read
app.get("/products", (req, res) => {
  res.json(products);
});

// GET สำหรับ Read แบบระบุ id
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((s) => s.id === id);
  res.json(product);
});

app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = req.body;
  const index = products.findIndex((s) => s.id === id);
  products[index] = product;
  res.json(product);
});

app.delete("/products/:id", () => {
  const id = Number(req.params.id);
  const index = products.findIndex((s) => s.id === id);
  products.splice(index, 1);
  res.json(products);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
