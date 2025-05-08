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
const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        quantity: {
            type: Number
        },
        unitPrice: {
            type: Number
        },
        subTotal: {
            type: Number
        },
        discount: discountSchema,
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"},
        color: {
            type: String,
            default: "default"
        },
        size: {
            type: String,
            default: "default"
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        status: {
            type: String,
            enum: ["completed", "incomplete", "defaulted"],
            default: "incomplete"
        }
    },
    { _id: false }
);
//THIS IS FOR ANYTHING THAT HAS TO DO WITH PAYSTACK PAYMENT
const paymentSchema = new mongoose.Schema(
    {
        reference: {
            type: String
        },
        method: {
            type: String
            //enum: ["card", "bank_transfer", ""]
        },
        amount: {
            type: Number
        }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    items: [itemSchema],

    totalCost: {
        type: Number
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "incomplete", "completed", "delivered"]
    },
    payment: paymentSchema,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const order = new mongoose.model("order", orderSchema);
module.exports = order;
//TODO: add a separate payment object, DONE