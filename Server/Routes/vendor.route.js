const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./Uploads/Products" });

const mongoose = require("mongoose");

const Product = require("../Models/product.model.js");
const User = require("../Models/user.model.js");
const Order = require("../Models/order.model.js");
const Review = require("../Models/review.model.js");
const Search = require("../Models/search.model.js");

const vendorController = require("../Controllers/vendor.controller.js");

const { authMiddleware } = require("../Utils/auth.middleware");
router.use(authMiddleware);

router.get("/", vendorController.getDashboard);
router.get("/products", vendorController.getProducts);

router.post(
    "/products/add",
    upload.single("productImage"),
    vendorController.addProduct
);
router.get("/products/add", async (req, res, next) => {
    try {
        const categories = await Product.schema.path("category").enumValues;
        const tags = await Product.distinct("tags");

        return res.render("Pages/Vendor/add_product", { categories, tags });
    } catch (err) {
        next(err);
    }
});

router.delete("/product/:id", vendorController.deleteProduct);
router.put(
    "/product/:id",
    upload.single("productImage"),
    vendorController.editProduct
);

router.post("/store", upload.single("coverImage"), vendorController.postStore);
router.get("/store", vendorController.getStore);

module.exports = router;
