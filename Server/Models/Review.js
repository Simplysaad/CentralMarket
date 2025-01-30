const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rating: Number,
  review: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})
const  Review = new mongoose.model("Review", reviewSchema);
module.exports = Review;
