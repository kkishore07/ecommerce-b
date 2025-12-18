const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/authMiddleware");

// Create Order
router.post("/", verifyToken, orderController.createOrder);

// Get User Orders
router.get(
  "/find/:userId",
  verifyTokenAndAuthorization,
  orderController.getUserOrders
);

// Get All Orders (Admin)
router.get("/", verifyTokenAndAdmin, orderController.getAllOrders);

// Update Order Status (Admin)
router.put("/:orderId", verifyTokenAndAdmin, orderController.updateOrderStatus);

// Delete Order (Admin)
router.delete("/:orderId", verifyTokenAndAdmin, orderController.deleteOrder);

module.exports = router;
