const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number
        },
        unitPrice: {
            type: Number
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        meta: {
            color: {
                type: String,
                default: "default"
            },
            size: {
                type: String,
                default: "default"
            }
        }
    },
    { _id: false }
);
const cartSchema = new mongoose.Schema({
    items: [itemSchema],
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    sessionId: {
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

cartSchema.virtual("total").get(function () {
    return this.items.reduce((acc, item) => acc + item.subTotal, 0);
});
itemSchema.virtual("subTotal").get(function () {
    return this.quantity * this.unitPrice;
});
cartSchema.virtual("quantity").get(function () {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

cartSchema.index({ customerId: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ "items.vendorId": 1 });
module.exports = new mongoose.model("carts", cartSchema);
