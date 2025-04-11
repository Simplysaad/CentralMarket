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

const { authMiddleware } = require("../Utils/auth.middleware");
router.use(authMiddleware);

const {
    addProduct,
    deleteProduct,
    editProduct,
    getProducts
} = require("../Controllers/vendor.controller.js");

router.get("/products", getProducts);
router.post(
    "/products/add",
    uploadProducts.single("productImage"),
    // upload.field([
    //     { name: "productImage", maxCount: 1 },
    //     { name: "productGallery", maxCount: 6 }
    // ]),
    addProduct
);
router.get("/products/add", async (req, res) => {
    try {
        return res.render("Pages/Vendor/add_product", {});
    } catch (err) {
        console.error(err);
    }
});

router.delete("/product/:id", deleteProduct);
router.put("/product/:id", uploadProducts.single("productImage"), editProduct);

module.exports = router;
