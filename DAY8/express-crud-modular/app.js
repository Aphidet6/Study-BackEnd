const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const setupSwagger = require("./middleware/swagger");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

// Swagger setup
setupSwagger(app);

// Routes
app.use("/products", productRoutes);

module.exports = app;
