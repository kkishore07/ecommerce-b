const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String },
    category: { type: String },
    rating: { type: Number },
    reviews: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
