const express = require("express");
const router = express.Router();
const { shuffle } = require("../Utils/helper.js");
//const fetch = require("node-fetch");
const { default: fetch } = require("node-fetch");

const Product = require("../Models/product.model.js");
const User = require("../Models/user.model.js");
const Order = require("../Models/order.model.js");
const Search = require("../Models/search.model.js");
const customerController = require("../Controllers/customer.controller.js");

router.get("/", customerController.getProducts);
router.get("/home", customerController.getHomeProducts);
//[new arrivals, top rated, deals of the day, christmas collection, clearance sales]

router.all("/search/:searchType", customerController.searchController);

router.get("/cart", customerController.getCart);
router.post("/cart/:id", customerController.postCart);
router.delete("/cart/:id", customerController.deleteCartItem);

router.get("/products", customerController.getProducts);
router.post("/order", customerController.postOrder);
router.get("/order", customerController.getOrder);
router.post("/order/massive", customerController.postOrderMassive);

module.exports = router;
