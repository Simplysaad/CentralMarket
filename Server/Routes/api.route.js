const express = require("express");
const router = express.Router();

//const fetch = require("node-fetch");
const { default: fetch } = require("node-fetch");

const Product = require("../Models/product.model.js");
const User = require("../Models/user.model.js");
const Order = require("../Models/order.model.js");
const Search = require("../Models/search.model.js");

router.get("/validate", async (req, res) => {
    try {
        let { emailAddress, phoneNumber } = req.body;
        isEmailExist = await Product.findOne({ emailAddress });

        if (isEmailExist)
            return res.status(401).json({
                message: "email already exists",
                success: false
            });

        let isPhoneNumberExist = await Product.findOne({ phoneNumber });
        if (isPhoneNumberExist)
            return res.status(401).json({
                message: "phone number already exists",
                success: false
            });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
