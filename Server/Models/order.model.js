const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }
    },
    { _id: false }
);
const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    items: [itemSchema],
    discount: {},
    totalCost: {
        type: Number
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "successful", "failed", "abandoned", "completed"]
    },
    paymentToken: {
        type: String
    },
    paymentMethod: {
        type: String,
        enum: ["card", "bank_transfer", ""]
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

orderSchema.virtual("subtotal").get(() => {
    return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
});

const order = new mongoose.model("order", orderSchema);
module.exports = order;
