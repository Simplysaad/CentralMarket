const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        text: true
    },
    description: {
        type: String,
        text: true
    },
    price: {
        type: Number,
        index: true
    },
    available: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["pending", "approved", "not approved"],
        default: "pending"
    },
    keywords: [String],
    category: {
        type: String,
        //index: true,
        text: true
    },
    imageUrl: {
        type: String
    },
    imageGallery: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    interests: {
        type: Number,
        default: 0
    },
    
    addToCartCount: {
        type: Number,
        default: 0
    },
    purchaseCount: {
        type: Number,
        default: 0
    },
    preveiewCount: {
        type: Number,
        default: 0
    }
});

const product = new mongoose.model("product", productSchema);
// product.createIndexes({
//     category: 1,
//     price: 1
// });
// product.createIndex({
//     name: "autocomplete",
//     mappings: {
//         fields: {
//             title: {
//                 type: "autocomplete",
//                 tokenization: "edgeGram"
//             }
//         }
//     }
// });
module.exports = product;
