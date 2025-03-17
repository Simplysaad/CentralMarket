const express = require("express");
const router = express.Router();

const Product = require("../Models/product");

router.get("/", async (req, res) => {
    try {
        // const products = await Product.find({}).sort({
        //     amountSold: -1,
        //     cartCount: -1
        // });
        // const categories = await Product.distinct("category");

        // return res.json({ categories, products });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
