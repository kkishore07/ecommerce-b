const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controller/cartController");
const { auth } = require("../middlewares/authMiddleware");

const router = express.Router();

// All cart routes are user-specific and require auth
router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.put("/:productId", auth, updateCartItem);
router.delete("/:productId", auth, removeFromCart);

module.exports = router;
