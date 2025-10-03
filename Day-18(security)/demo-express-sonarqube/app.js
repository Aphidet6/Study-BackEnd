require('dotenv').config();
const express = require("express");

const app = express();
app.disable("x-powered-by");


app.get("/", (req, res) => {
  console.log("Hello, world!");
  res.send("Hello, world!");
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});