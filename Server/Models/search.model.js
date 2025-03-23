const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        imageUrl: {
            type: String
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }
    },
    { _id: false }
);
const searchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    searchTerm: {
        type: String
    },
    items: [itemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const search = new mongoose.model("search", searchSchema);
search.createIndexes({
    items: 1,
    createdAt: -1
});
module.exports = search;
