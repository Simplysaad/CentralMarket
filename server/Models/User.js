const mongoose = require("mongoose");

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
        enum: ["vendor", "customer", "admin"],
        default: "customer"
    },
    businessDesc: {
        type: String
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

UserSchema.index({ role: 1, products: 1, orders: -1 });
const User = new mongoose.model("User", UserSchema);
module.exports = User



//https://apitester.org/ieJw9yjsOwjAMANByD4ZM6UYyVpUiPhNCggFOYDVWEimJi.2q12fjze92eN6H4YW7eeN3Q1EzHcesus7OVVqgZhKdJ..9Y0xFFPncoWF4bKIfgGgsU8UAsZVusUGp1xgZRcy:XFIrUE8LNbuCyE4cTeikufSUkXH8AaUsLrc
