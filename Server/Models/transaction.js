const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({});

const transaction = new mongoose.model("transaction", transactionSchema);
module.exports = transaction;
