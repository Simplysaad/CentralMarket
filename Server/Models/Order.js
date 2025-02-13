const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  size: {
    type: String,
    default: "default"
  },
  color: {
    type: String,
    default: "default"
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  broughtIn: {
    type: Boolean,
    default: false
  }

}, { _id: false })

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [itemSchema],
  subTotal: Number,
  tax: Number,
  shippingCost: Number,
  totalCost: Number,
  deliveryStatus: {
    type: String,
    default: "pending",
    enum: ["pending", "en route", "delivered", "delayed", "cancelled"]
  },
  deliveryAddress: {
    recipientName: String,
    street: String, //Block   and room no
    city: String, //Hostel
    state: String, // School
    zipcode: String
  },
  paymentMethod: String,
  paymentStatus: {
    type: String,
    default: "pending",
    enum: ["failed", "pending", "cancelled", "successful"]
  },
  paymentDate: {
    type: Date
  },
  deliveryDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
const Order = new mongoose.model("Order", OrderSchema);
module.exports = Order;
