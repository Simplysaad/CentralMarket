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

const bankDetailsSchema = new mongoose.Schema(
    {
        accountName: String,
        accountNumber: String,
        bankName: String
    },
    { _id: false }
);
const businessSchema = new mongoose.Schema(
    {
        name: String,
        description: {
            type: String
        },
        category: String,
        coverImage: {
            type: String,
            default: "https://placehold.co/600x200?text=CentralMarket+Store"
        },
        address: addressSchema,

        //not useful for now
        tags: [String],
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
    bankDetails: bankDetailsSchema,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "vendor", "customer"],
        default: "customer"
        //required: true
    },
    business: businessSchema,
    address: addressSchema,
    birthDate: {
        type: Date
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    wishlist: [String],
    // wishlist: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "products"
    //     }
    // ],
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
        "business.name": 1
    },
    { sparse: true, unique: true }
);

const user = new mongoose.model("user", userSchema);
module.exports = user;
