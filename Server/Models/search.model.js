const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        name: { type: String },
        imageUrl: { type: String },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" }
    },
    { _id: false }
);

const vendorSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        businessName: { type: String },
        profileImage: { type: String },
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
    },
    { _id: false }
);

const resultSchema = new mongoose.Schema(
    {
        products: [productSchema],
        vendors: [vendorSchema]
    },
    { _id: false }
);

const searchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        
    },
    searchTerm: { type: String, required: true },
    searchResults: resultSchema,
    createdAt: { type: Date, default: Date.now }
});

searchSchema.index({ searchTerm: "text" });
searchSchema.index({ userId: 1, createdAt: -1 });

const Search = mongoose.model("Search", searchSchema);

module.exports = Search;
