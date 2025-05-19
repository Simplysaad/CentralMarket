const express = require("express");
const router = express.Router();
const { shuffle } = require("../Utils/helper.js");
//const fetch = require("node-fetch");
const { default: fetch } = require("node-fetch");

const Search = require("../Models/search.model.js");

const mainController = require("../Controllers/main.controller.js");

router.get("/", mainController.getHomeProducts);
router.get("/home", mainController.getProducts);
router.get("/products", mainController.getProducts);

//[new arrivals, top rated, deals of the day, christmas collection, clearance sales]

router.all("/search", mainController.searchController);

router.get("/cart", mainController.getCart);
router.post("/cart/:id", mainController.postCart);
router.delete("/cart/:id", mainController.deleteCartItem);

router.get("/preview/:id", mainController.getPreview);
router.get("/preview/", mainController.getPreviewRandom);

router.post("/order", mainController.postOrder);
router.get("/order", mainController.getOrder);
router.post("/order/massive", mainController.postOrderMassive);

router.get("/category/:categoryName?/", mainController.getCategoryProducts);

router.post("/review/:id", mainController.postReview);
router.get("/review/:id?/", mainController.getReviewPage);

router.get("/store/:id?/", mainController.getStore);

module.exports = router;
