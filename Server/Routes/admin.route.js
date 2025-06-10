const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./Uploads" });

const cloudinary = require("../Utils/cloudinary.js")

const Product = require("../Models/product.model.js");

const { authMiddleware } = require("../Utils/auth.middleware");
router.use(authMiddleware);

const adminController = require("../Controllers/admin.controller.js");

router.get("/products/", adminController.getProducts);

router.post(
    "/products/",
    upload.single("productImage"),
    // upload.array("productImages", 6),
    adminController.addProduct
);
router.delete("/products/:id", adminController.deleteProduct);
router.put("/products/:id", adminController.editProduct);

// router.post("/", async (req, res) => {
//     try {
//         let products = require("./dummy.json");
//         console.log(products.length);

//         products.forEach(async product => {
//             await Product.updateOne(
//                 { imageUrl: product.imageUrl },
//                 {
//                     $set: {
//                         subCategory: product.subCategory
//                     }
//                 },
//                 {
//                     new: true
//                 }
//             ).then(data => console.log(data));
//         });
//         return res.json({});
//     } catch (err) {
//         console.error(err);
//     }
// });
module.exports = router;
