const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
    {
        street: String,
        city: String,
        state: String,
        address_type: {
            type: String,
            enum: ["home", "work", "other"],
            default: "home"
        },
        country: {
            type: String,
            default: "nigeria"
        },
        longitude: Number,
        latitude: Number,
        zipcode: String
    },
    { _id: true }
);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    emailAddress: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "manager", "employee", "customer"],
        required: true
    },
    address: addressSchema,
    
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "products"
    }],
    orderHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders"
    }],
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const user = new mongoose.model("user", userSchema);
user.createIndexes({
    emailAddress: 1,
    profileImage: 1
});
module.exports = user;
