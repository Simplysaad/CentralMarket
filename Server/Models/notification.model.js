const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    message: {
        type: String
    },
    callbackUrl: {
        type: String
    },
    type: {
        type: String,
        enum: ["review", "stock alert", "payment", "order", "inventory"]
    }
});

exports.notification = new mongoose.model(
    "notification",
    notificationSchema
);
