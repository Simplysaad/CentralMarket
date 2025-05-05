const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
    {
        address: String,
        state: String,
        type: {
            type: String,
            enum: ["home", "work", "other"],
            default: "home"
        },
        school: String,
        country: {
            type: String,
            default: "nigeria"
        },

        longitude: Number,
        latitude: Number,
        zipcode: String
    },
    { _id: false }
);
const businessSchema = new mongoose.Schema(
    {
        name: String,

        description: {
            type: String
        },
        keywords: [String],
        address: addressSchema,
        type: {
            type: String,
            enum: ["online", "offline", "hybrid"],
            default: "hybrid"
        }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: "https://placehold.co/400x400"
    },
    coverImage: {
        type: String,
        default: "https://placehold.co/600x200?text=CentralMarket+Store"
    },
    emailAddress: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String
        //, unique: true,
        //,required: true
    },
    socials: [
        {
            name: String,
            url: String
        }
    ],
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "vendor", "customer"],
        required: true
    },
    businessName: {
        type: String
        //unique: true
    },
    description: {
        type: String
    },

    address: addressSchema,
    birthDate: {
        type: Date
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orders"
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

userSchema.index({
    emailAddress: 1,
    profileImage: 1
});
userSchema.index(
    {
        businessName: 1
    },
    { sparse: true, unique: true }
);

const user = new mongoose.model("user", userSchema);
module.exports = user;
