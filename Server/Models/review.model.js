const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    rating: Number,
    message: String,
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    response: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const Review = new mongoose.model("Review", reviewSchema);
module.exports = Review;
