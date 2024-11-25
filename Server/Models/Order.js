const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
const Order = new mongoose.model("Order", OrderSchema);
module.exports = Order;
