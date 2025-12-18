require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(cors());

const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const authRouter = require("./routes/auth");
const ordersRouter = require("./routes/orders");
const authMiddleware = require("./middlewares/authMiddleware");

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/auth", authRouter);
app.use("/orders", ordersRouter);

const { auth } = authMiddleware;
app.get("/profile", auth, (req, res) => {
  res.status(200).json({ message: "Profile data", user: req.user });
});

const connectDB = require("./config/db");
connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
});
