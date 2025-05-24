const express = require("express");
const router = express.Router();

const multer = require("multer");
const uploadProducts = multer({ dest: "./Uploads/Products" });
const conditionalMulter = (req, res, next) => {
    if (!req.file) {
        return next();
    } else {
        uploadProducts.single("productImage")(req, res, () => {
            if (err) {
                return next(err);
            }
            next();
        });
    }
};
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
    conditionalMulter,
    // upload.field([
    //     { name: "productImage", maxCount: 1 },
    //     { name: "productGallery", maxCount: 6 }
    // ]),
    vendorController.addProduct
);
router.get("/products/add", async (req, res, next) => {
    try {
        return res.render("Pages/Vendor/add_product", {});
    } catch (err) {
        next(err);
    }
});

router.delete("/product/:id", vendorController.deleteProduct);
router.put(
    "/product/:id",
    conditionalMulter,
    vendorController.editProduct
);

module.exports = router;
