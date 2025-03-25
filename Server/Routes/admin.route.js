const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./Uploads" });


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
} = require("../Controllers/admin.controller.js");

router.get("/products/", getProducts);
router.post(
    "/products/",
    upload.single("productImage"),
    // upload.array("productImages", 6),
    addProduct
);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", editProduct);

module.exports = router;
