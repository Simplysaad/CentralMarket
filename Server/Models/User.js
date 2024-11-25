const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
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
        enum: ["vendor", "customer", "admin"],
        default: "customer"
    },
    businessName: {
        type: String,
        unique: true
    },
    businessDesc: {
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

//UserSchema.index({ role: 1, products: 1, orders: -1 });
const User = new mongoose.model("User", UserSchema);
module.exports = User;
