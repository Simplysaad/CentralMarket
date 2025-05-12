const express = require("express");
const router = express.Router();
const { shuffle } = require("../Utils/helper.js");
//const fetch = require("node-fetch");
const { default: fetch } = require("node-fetch");

const Product = require("../Models/product.model.js");
const Review = require("../Models/review.model.js");
const User = require("../Models/user.model.js");
const Order = require("../Models/order.model.js");
const Search = require("../Models/search.model.js");

const accountController = require("../Controllers/account.controller.js");

router.get("/cart/:id?/", accountController.getCart);
router.post("/cart/:id", accountController.postCart);
router.delete("/cart/:id", accountController.deleteCartItem);

router.get("/history", accountController.getHistory);

router.get("/wishlist/:id?/", accountController.getWishlist);
router.post("/wishlist/:id", accountController.postWishlistItem);
router.delete("/wishlist/:id", accountController.deleteWishlistItem);

module.exports = router;
