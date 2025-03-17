const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    category: {
      type: String,
      
    }
});

const product = new mongoose.model("product", productSchema);
module.exports = product;
