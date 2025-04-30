const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        value: {
            type: Number,
            default: 0
        },
        type: {
            type: String,
            enum: ["amount", "percentage"]
        }
    },
    { _id: false }
);

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
    condition: {
        type: String,
        enum: ["new", "used"],
        required: true
    },
    discount: discountSchema,
    available: {
        type: Boolean,
        default: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    averageRating: {
        type: Number,
        default: 5
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    keywords: [String],
    category: {
        type: String,
        //index: true,
        text: true,
        enum: [
            "study materials",
            "electronics",
            "hostel essentials",
            "clothing and accessories",
            "groceries and snacks",
            "health and personal care",
            "events and experiences",
            "secondhand marketplace",
            "services",
            "hobbies and entertainment",
            "gifts and handmade goods"
        ]
    },
    subCategory: String,
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
