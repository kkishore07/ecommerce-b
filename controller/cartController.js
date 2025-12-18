const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(200).json({ message: "Cart empty", cart: [] });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Error reading cart:", error.message);
    return res.status(500).json({ message: "Error reading cart" });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId || !isValidObjectId(productId)) {
    return res.status(400).json({ error: "Invalid productId" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        products: [{ product: productId, quantity }],
      });
      return res.status(200).json({ message: "Cart created", cart });
    }

    // If product already in cart, increment quantity; else push new
    const existing = cart.products.find((p) =>
      p.product.equals(productId)
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    return res.status(500).json({ message: "Error adding to cart" });
  }
};

const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!productId || !isValidObjectId(productId)) {
    return res.status(400).json({ error: "Invalid productId" });
  }
  if (quantity === undefined || quantity === null || quantity < 0) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.products.find((p) => p.product.equals(productId));
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (quantity === 0) {
      cart.products = cart.products.filter((p) => !p.product.equals(productId));
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    return res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Error updating cart item:", error.message);
    return res.status(500).json({ message: "Error updating cart" });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  if (!productId || !isValidObjectId(productId)) {
    return res.status(400).json({ error: "Invalid productId" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const before = cart.products.length;
    cart.products = cart.products.filter((p) => !p.product.equals(productId));
    if (cart.products.length === before) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    await cart.save();
    return res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    console.error("Error removing cart item:", error.message);
    return res.status(500).json({ message: "Error removing from cart" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
