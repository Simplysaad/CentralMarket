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

router.post("/order", customerController.postOrder);
router.get("/order", customerController.getOrder);
router.post("/order/massive", customerController.postOrderMassive);

router.get("/category/:categoryName", customerController.getCategoryProducts);
router.post("/review/:id", async (req, res) => {
    try {
        let { helpful, reviewId, rating, message } = req.body;
        let { id: productId } = req.params;
        let { currentUser } = req.session;

        if (helpful === "true" && reviewId) {
            let currentReview = await Review.findOneAndUpdate(
                { _id: reviewId },
                {
                    $inc: {
                        helpfulVotes: 1
                    }
                }
            );
            return res.status(200).json({ currentReview });
        }
        // if (message && rating) {
        let newReview = new Review({
            message,
            rating,
            productId,
            customerId: currentUser._id
        });

        let currentProduct = await Product.findOneAndUpdate(
            {
                _id: productId
            },
            {
                $push: {
                    ratings: rating
                }
            },
            {
                new: true
            }
        );
        await newReview.save();
        return res.status(304).redirect(`/preview/${productId}#reviewsSection`);
        // }
    } catch (err) {
        console.error(err);
    }
});
router.get("/review/:id", async (req, res) => {
    try {
        let { id: productId } = req.params;
        let currentProduct = await Product.findOne({ _id: productId }).select(
            "_id name"
        );
        let { currentUser = { name: "guest" } } = req.session;
        if (productId)
            return res
                .status(200)
                .render("Pages/Customer/review_page", {
                    currentProduct,
                    currentUser
                });
    } catch (err) {
        console.error(err);
    }
});
module.exports = router;
