const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
  },
  type: {
    type: String,
    enum: ["order", "products", "payment", "review", "miscellaneous"],
    default: "miscellaneous"
  },
  status: {
    type: String,
    enum: ["read", "unread"],
    default: "unread"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, {_id: false})
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
    default: "random-profile.jpg"
  },
  deliveryAddress: {
    recipientName: String,
    street: String,
    city: String,
    state: String,
    zipcode: String
  },
  notifications: [notificationSchema],
  businessName: {
    type: String,
    unique: true
  },
  businessDesc: {
    type: String
  },
  coverImage: {
    type: String, 
    default: "random-color.jpg"
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

//UserSchema.index({ role: 1, products: 1, orders: -1 });
const User = new mongoose.model("User", UserSchema);
module.exports = User;
