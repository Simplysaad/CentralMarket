const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        text: true
    },
    price: {
        type: Number,
        index: true
    },
    category: {
        type: String,
        index: true
    },
    imageUrl: {
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

const product = new mongoose.model("product", productSchema);
product.createIndexes({
    category: 1,
    price: 1
});
module.exports = product;
