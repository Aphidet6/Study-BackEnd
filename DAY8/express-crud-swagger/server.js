const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// สร้าง Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

// การเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mynewpassword",
  database: "ecommerce_db",
});

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      version: "1.0.0",
      description: "API ตัวอย่างสำหรับ Products",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          required: ["name", "price", "discount", "review_count", "image_url"],
          properties: {
            id: {
              type: "integer",
              description: "The auto-generated id of the product",
            },
            name: { type: "string", description: "The product name" },
            price: { type: "number", description: "The product price" },
            discount: { type: "number", description: "The product discount" },
            review_count: {
              type: "integer",
              description: "The product review count",
            },
            image_url: { type: "string", description: "The product image URL" },
          },
        },
      },
    },
  },
  apis: ["server.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 */
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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 */
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

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
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

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
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

/**
 * @swagger
 * /products/search/{keyword}:
 *   get:
 *     summary: Search products by keyword
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 */
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
  console.log(
    `Swagger documentation available at http://localhost:${port}/api-docs`
  );
});
