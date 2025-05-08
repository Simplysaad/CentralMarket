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

router.get("/", async (req, res, next) => {
    try {
        let { currentUser } = req.session;
        let vendorId = new mongoose.Types.ObjectId(currentUser._id);
        //next(err)
        let myProducts = await Product.find({ vendorId });
        let myOrders = await Order.aggregate([
            {
                $match: { "items.vendorId": vendorId }
            },
            {
                $unwind: "$items"
            },
            {
                $match: { "items.vendorId": vendorId }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        let completedOrders = myOrders.filter(
            order => order.items.status === "completed"
        );

        let today = Date.now();
        let weekAgo = today - 1000 * 60 * 60 * 24 * 7;

        let allCustomers = await Order.aggregate([
            {
                $match: {
                    "items.vendorId": vendorId
                }
            },
            {
                $group: {
                    _id: "$customerId",
                    orderCount: { $sum: 1 }
                }
            }
        ]);
        // NEW CUSTOMERS IN THE PAST WEEK
        let newCustomers = await Order.aggregate([
            {
                $match: {
                    "items.vendorId": vendorId
                    //, createdAt: {
                    //     $gte: new Date(weekAgo),
                    //     $lte: new Date(today)
                    // }
                }
            },
            {
                $group: {
                    _id: "$customerId",
                    orderCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    orderCount: 1
                }
            }
        ]);
        let revenue = await Order.aggregate([
            {
                $match: {
                    "items.vendorId": vendorId
                }
            },
            {
                $unwind: "$items"
            },
            {
                $match: {
                    "items.vendorId": vendorId
                }
            },
            {
                $group: {
                    _id: null,
                    // totalRevenue: {
                    //     $sum: "$items.subTotal"
                    // },
                    totalRevenue: {
                        $sum: "$items.subTotal"
                    }
                }
            }
        ]);

        let totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;
        return res.status(200).render("Pages/Vendor/dashboard.ejs", {
            myOrders,
            completedOrders,
            allCustomers,
            newCustomers,
            myProducts,
            totalRevenue
        });
    } catch (err) {
        next(err);
    }
});
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
