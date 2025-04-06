const express = require("express");
const router = express.Router();

//const fetch = require("node-fetch");
const { default: fetch } = require("node-fetch");

const Product = require("../Models/product.model.js");
const User = require("../Models/user.model.js");
const Order = require("../Models/order.model.js");
const Search = require("../Models/search.model.js");
const {
    postCart,
    deleteCartItem,
    searchController,
    getCart,
    atlasSearchController,
    getProducts
} = require("../Controllers/customer.controller.js");

router.all("/search", searchController);
router.all("/atlas-search", atlasSearchController);

router.get("/cart", getCart);
router.post("/cart/:id", postCart);
router.delete("/cart/:id", deleteCartItem);

router.get("/products", getProducts);

router.post("/order", async (req, res) => {
    try {
        let { userId: customerId, cart: items } = req.session;
        console.log("items", items);
        console.log("req.session", req.session);
        //let { customerId, items } = req.body;

        // if (!customerId)
        //     return res.status(403).json({
        //         success: false,
        //         message: "user not logged in"
        //     });

        items.forEach(async item => {
            let itemId = item.productId;

            let updatedItem = await Product.findOneAndUpdate(
                { _id: itemId },
                {
                    $inc: {
                        purchaseCount: item.quantity
                    }
                },
                { new: true }
            );
        });

        let newOrder = new Order({
            customerId,
            items
        });

        await newOrder.save().then(() => {
            req.session.cart = [];
            console.log("cart cleared");
        });

        return res.status(200).json({
            success: true,
            message: "order placed successfully",
            newOrder
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "error encountered while placing order"
        });
    }
});
router.get("/order", async (req, res) => {
    try {
        let allOrders = await Order.find();
        return res.status(200).json({
            success: true,
            message: "orders retrieved successfully",
            allOrders
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "error encountered while placing order"
        });
    }
});
router.post("/order/massive", async (req, res) => {
    try {
        let allProducts = await Product.find({}).select("_id name price");
        let { massive = 5 } = req.query;

        let BASE_URL = "http://localhost:8000";

        // for (let i = 0; i < massive; i++) {
        let randomQuantity = Math.floor(Math.random() * 10);
        let randomCartLength = Math.floor(Math.random() * 10);
        let randomIndex = Math.floor(Math.random() * allProducts.length);

        let randomItem = allProducts[randomIndex];

        //     console.log(
        //         "randomQuantity",
        //         randomQuantity,
        //         "randomCartLength",
        //         randomCartLength,
        //         "randomItem",
        //         randomItem
        //     );
        //     setTimeout(async function () {
        //         let orderResponse = await fetch(`${BASE_URL}/order`, {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json"
        //             }
        //         });
        //     }, 3000);
        // }
        for (let i = 0; i < randomCartLength; i++) {
            fetch(
                // `${BASE_URL}/cart/${randomItem._id}?quantity=${randomQuantity}`,
                `/cart/${randomItem._id}?quantity=${randomQuantity}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                }
            )
                .then(response => response.json())
                .then(data => console.log("cart data", data));

            //console.log("orderResponse", orderResponse);
        }
        return res.status(200).json({
            success: true,
            message: "massive orders made successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "error encountered while placing massive orders",
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
});

module.exports = router;
