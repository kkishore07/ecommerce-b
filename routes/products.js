const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error reading products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error reading product" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, price, originalPrice, image, category, rating, reviews } =
      req.body;
    const newProduct = new Product({
      name,
      price,
      originalPrice,
      image,
      category,
      rating,
      reviews,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating product", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, price, originalPrice, image, category, rating, reviews } =
      req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        originalPrice,
        image,
        category,
        rating,
        reviews,
      },
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating product", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
