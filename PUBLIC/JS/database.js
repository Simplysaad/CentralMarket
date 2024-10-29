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
            "baby and kids",
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

const Product = new mongoose.Model("Products", ProductSchema);

const UserSchema = new mongoose.Schema({
    name: String,
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    role: {
        type: String,
        enum: ["vendor", "buyer", "admin"],
        default: "buyer"
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Orders"
        }
    ],
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
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
const User = new mongoose.Model("Users", UserSchema);

const OrderSchema = new mongoose.Schema({
    items: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products"
            },
            size: String,
            color: String,
            price: {
                type: Number,
                required: true
            },
            quantity: Number
        }
    ],
    deliveryStatus: {
        type: String,
        default: "pending",
        enum: ["pending", "en route", "delivered", "delayed", "cancelled"]
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipcode: String
    },
    paymentMethod: String,
    paymentStatus: {
        type: String,
        default: "pending",
        enum: ["failed", "pending", "cancelled", "paid"]
    },
    paymentDate: {
        type: Date
    },
    deliveryDate: Date,
    orderDate: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const Order = new mongoose.Model("Orders", UserSchema);
