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
        enum: ["new", "used", "old"],
        default: "new"
    },
    discount: discountSchema,
    amountInStock: {
        type: Number,
        default: 1
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    // averageRating: {
    //     type: Number,
    //     default: 5
    // },
    ratings: [Number],
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
            "events merchandise",
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
    expiresAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    meta: {
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
        previewCount: {
            type: Number,
            default: 0
        },
        sources: [
            {
                name: String,
                count: {
                    type: Number,
                    default: 0
                }
            }
        ]
    }
});
productSchema.virtual("averageRating").get(function () {
    if (!this.ratings || this.ratings.length === 0) return 5.0;

    let sum = this.ratings.reduce((acc, rating) => acc + rating, 0);
    let average = sum / this.ratings.length;
    return parseFloat(average.toFixed(1));
});
productSchema.virtual("slug").get(function () {
    let regex = new RegExp("[^\\w]+", "ig");
    return this.name.replace(regex, "-") + "--" + this._id;
});

module.exports = new mongoose.model("product", productSchema);
