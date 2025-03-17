const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({});

const user = new mongoose.model("user", userSchema);
module.exports = user;
