const express = require("express");
const router = express.Router();

const Product = require("../Models/product.model.js");
const User = require("../Models/user.model.js");
const { Search } = require("../Models/search.model.js");
const {
    postCart,
    deleteCartItem,
    searchController, getCart
} = require("../Controllers/customer.controller.js");

router.all("/search", searchController);

router.get("/cart", getCart);
router.post("/cart/:id", postCart);
router.delete("/cart/:id", deleteCartItem);

module.exports = router;
