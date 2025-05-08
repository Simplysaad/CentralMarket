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

const customerController = require("../Controllers/customer.controller.js");

router.get("/", customerController.getHomeProducts);
router.get("/home", customerController.getProducts);
router.get("/products", customerController.getProducts);

//[new arrivals, top rated, deals of the day, christmas collection, clearance sales]

router.all("/search/:searchType", customerController.searchController);

router.get("/cart", customerController.getCart);
router.post("/cart/:id", customerController.postCart);
router.delete("/cart/:id", customerController.deleteCartItem);

router.get("/preview/:id", customerController.getPreview);
router.get("/preview/", customerController.getPreviewRandom);

router.post("/order", customerController.postOrder);
router.get("/order", customerController.getOrder);
router.post("/order/massive", customerController.postOrderMassive);

router.get("/category/:categoryName", customerController.getCategoryProducts);

router.post("/review/:id", customerController.postReview);
router.get("/review/:id", customerController.getReviewPage);

router.get("/store/:id", async (req, res) => {
  try {
    let { id: vendorId } = req.params;
    let { currentUser } = req.session;

    let currentVendor = await User.findOne({ _id: vendorId }); //.select("name business")
    let currentVendorProducts = await Product.find({ vendorId }); //.select("name business")
    let isCurrentVendor = currentVendor._id === currentUser._id;

    console.log({
      currentVendor,
      products: currentVendorProducts,
      isCurrentVendor
    })

    return res.status(200).render("Pages/Customer/store_page", {
      currentVendor,
      products: currentVendorProducts,
      isCurrentVendor
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
