const express = require("express");
const router = express.Router();

const multer = require("multer");
const uploadProducts = multer({ dest: "./Uploads/Products" });

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const Product = require("../Models/product.model.js");
const User = require("../Models/user.model.js");
const Order = require("../Models/order.model.js");
const Review = require("../Models/review.model.js");
const Search = require("../Models/search.model.js");
const vendorController = require("../Controllers/vendor.controller.js");

const { authMiddleware } = require("../Utils/auth.middleware");
router.use(authMiddleware);

router.get("/", async (req, res) => {
    try {
        let myOrders = await Order.aggregate([
            {
                $unwind: "$items"
            }
        ]);
        return res.json({ myOrders });
    } catch (err) {
        console.error(err);
    }
});
router.get("/products", vendorController.getProducts);
router.post(
    "/products/add",
    uploadProducts.single("productImage"),
    // upload.field([
    //     { name: "productImage", maxCount: 1 },
    //     { name: "productGallery", maxCount: 6 }
    // ]),
    vendorController.addProduct
);
router.get("/products/add", async (req, res) => {
    try {
        return res.render("Pages/Vendor/add_product", {});
    } catch (err) {
        console.error(err);
    }
});

router.delete("/product/:id", vendorController.deleteProduct);
router.put(
    "/product/:id",
    uploadProducts.single("productImage"),
    vendorController.editProduct
);



module.exports = router;
