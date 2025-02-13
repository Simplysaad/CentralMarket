const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  brand: String,
  productModel: String,
  tags: [String],
  isFeatured: {
    type: Boolean,
    required: true,
    default: false
  },
  productImage: {
    type: String,
    required: true
  },
  productGallery: [String], //URLs or files
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "NGN"
  },
  discount: Number,
  category: {
    type: String,
    default: "General",
    required: true
  },
  subCategory: String,
  amountInStock: {
    type: Number,
    default: 0
  },
  amountSold: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reviews"
  }],
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  variations: [
    {
      sizes: String,
      color: String,
      price: Number,
      stock: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  previewCount: Number
});

const Product = new mongoose.model("Product", ProductSchema);
module.exports = Product;
