const express = require("express");
const router = express.Router();

//const fetch = require("node-fetch");
const { default: fetch } = require("node-fetch");

const Product = require("../Models/product.model.js");
const User = require("../Models/user.model.js");
const Order = require("../Models/order.model.js");
const Search = require("../Models/search.model.js");

router.post("/validate", async (req, res) => {
    try {
        let { emailAddress, phoneNumber } = req.body;
        let isEmailExist = await Product.findOne({ emailAddress }).select(
            "_id"
        );

        if (isEmailExist)
            return res.status(401).json({
                message: "email already exists",
                success: false,
                isEmailExist
            });

        let isPhoneExist = await Product.findOne({ phoneNumber }).select(
            "_id "
        );
        if (isPhoneExist)
            return res.status(401).json({
                message: "phone number already exists",
                success: false,
                isPhoneExist
            });
        return res.status(200).json({
            message: "neither phone number nor email exists yet",
            success: true
        });
    } catch (err) {
        console.error(err);
    }
});

router.get("/update", async (req, res) => {
    try {
        let allProducts = await Product.find({});
        let allUsers = await User.find({});

        allProducts.forEach(async (product, index) => {
            let randomIndex = Math.floor(Math.random() * allUsers.length);

            let updatedProducts = await Product.findOneAndUpdate(
                { _id: product._id },
                {
                    $set: {
                        imageUrl: `https://placehold.co/400?text=${product.name
                            .split(" ")
                            .join("+")}`,
                        vendorId: allUsers[randomIndex]._id
                    }
                }
            );
            
            console.log(
                `product ${product._id}, name: ${product.name} updated`
            );
        });
        return res.json({
                message: `product {product._id}, name: {product.name} updated`
            });
    } catch (err) {
        console.error(err);
    }
});
module.exports = router;
