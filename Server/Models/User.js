/** @format */

const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            index: true
        },
        body: {
            type: String
        },
        type: {
            type: String,
            enum: [
                "order",
                "products",
                "payment",
                "review",
                "general",
                "mesaage"
            ],
            default: "general"
        },
        status: {
            type: String,
            enum: ["read", "unread", "deleted", "archived"],
            default: "unread"
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        link: String
    },
    { _id: false }
);
const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        senderName: {
            type: String,
            default: "Anonymous"
        },
        messageText: String,
        messageStatus: {
            type: String,
            enum: ["read", "unread"],
            default: "unread"
        },
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
    profileImage: {
        type: String,
        default: "https://placehold.co/400"
    },
    coverImage: {
        type: String,
        default: "https://placehold.co/600x200"
    },
    deliveryAddress: {
        recipientName: String,
        street: String,
        city: String,
        state: String,
        zipcode: String
    },
    notifications: [notificationSchema],
    messages: [messageSchema],
    businessName: {
        type: String
        // ,unique: true
    },
    businessDesc: {
        type: String
    },
    bankDetails: {
        account_number: Number,
        account_name: String,
        recipient_type: {
            type: String,
            default: "nuban"
        },
        bank_code: String
    },
    socials: [
        {
            name: String,
            url: String
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

//UserSchema.index({ role: 1, products: 1, orders: -1 });
const User = new mongoose.model("User", UserSchema);
module.exports = User;
