const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        items: [
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
                subTotal: {
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
    },
    { _id: false }
);

cartSchema.virtual("total").get(() => {
    return this.items.reduce((acc, item) => acc + item.subTotal, 0);
});
cartSchema.virtual("quantity").get(() => {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

cartSchema.index({ customerId: 1 });
cartSchema.index({ "items.vendorId": 1 });
module.exports = new mongoose.model("carts", cartSchema);
