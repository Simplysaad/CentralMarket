const express = require("express");
const router = express.Router();

const Product = require("../Models/product");
const authMiddleware = require("../Utils/auth.middleware");

router.post("/products/add", async (req, res) => {
    try {
        if (!req.body)
            return res.status(401).json({
                success: false,
                message: "nothing is being sent"
            });
            let newProduct = req.body
        // let newProduct = new Product({
        //     ...req.body
        // });
        // let savedProduct = await newProduct.save();
        //return res.json({ newProduct, savedProduct });

        return res.json({ newProduct });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
