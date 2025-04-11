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

router.get("/", async (req, res) => {
    try {
        // GET NEW ARRIVALS
        let newArrivals = await Product.find({})
            .sort({ createdAt: -1 })
            .limit(14);
        //newArrivals = shuffle(newArrivals);

        //DEALS OF THE DAY
        let deals = await Product.find({ discount: { $gt: 0 } });
        //deals = shuffle(deals, 14);

        //FEATURED BRANDS
        let featuredProducts = await Product.find({ isFeatured: true })
            .sort({ updatedAt: -1 })
            .limit(16);
        //   featuredProducts = shuffle(featuredProducts);

        //TOP RATED PRODUCTS
        let topRatedProducts = await Product.find({})
            .sort({ averageRating: -1 })
            .limit(16);

        let cart = req.session.cart ? req.session.cart : [];
        const checkCart = product => {
            if (product) {
                let item = cart.find(
                    item => item.productId === product._id.toString()
                );
                //console.log("cart item", item);
                return item;
            } else {
                return cart.length ? cart.length : "";
            }
        };

        const checkWishList = product => {
            let { wishlist } = req.session || currentUser || [];
            if (product) {
                return wishlist.find(item => item === product._id);
            } else {
                return wishlist.length ? wishlist.length : ""
            }
        };
        return res.status(200).render("Pages/customer", {
            topRatedProducts,
            featuredProducts,
            deals,
            checkCart,
            checkWishList,
            newArrivals
        });
    } catch (err) {
        console.error(err);
    }
});
//[new arrivals, top rated, deals of the day, christmas collection, clearance sales]

router.all("/search", customerController.searchController);
router.all("/atlas-search", customerController.atlasSearchController);

router.get("/cart", customerController.getCart);
router.post("/cart/:id", customerController.postCart);
router.delete("/cart/:id", customerController.deleteCartItem);

router.get("/products", customerController.getProducts);
router.post("/order", customerController.postOrder);
router.get("/order", customerController.getOrder);
router.post("/order/massive", customerController.postOrderMassive);

module.exports = router;
