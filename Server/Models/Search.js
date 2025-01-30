const mongoose = require('mongoose')
const searchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  searchTerm: String,
  searchResults: [{
    productId: {
   // _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})
const Search = new mongoose.model("Search", searchSchema);
module.exports = Search;
