require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});