const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    images: [String], //URLs or files
    tags: [String],
    price: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        default: "NGN"
    },
    category: {
        type: String,
        enum: [
            "electronics",
            "Fashion",
            "health and wellness",
            "home and kitchen",
            "sports and outdoors",
            "books",
            "travel and leisure",
            "office supplies",
            "automotive"
        ],
        default: "General",
        required: true
    },
    subCategory: String,
    tags: [String],
    stock: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reviews"
        }
    ],
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
    }
});

const Product = new mongoose.model("Product", ProductSchema);
module.exports = Product