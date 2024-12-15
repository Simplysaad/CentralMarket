const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");

const storage = multer.diskStorage({
    destination: "PUBLIC/Uploads/Users",
    filename: function (req, file, cb) {
        let myFileName = Date.now() + "_" + file.originalname;
        cb(null, myFileName);
    }
});

const upload = multer({
    storage: storage
});

const Product = require("../Models/Product.js");
const User = require("../Models/User.js");
const Order = require("../Models/Order.js");

const { relatedProductsFunc } = require("../Utils/helper.js");

const locals = {
    title: "Campus Mart",
    description:
        "an incampus shopping website for school online vendors and students, to buy , sell and deliver items without hassle",
    imageUrl: "/IMG/favicon.png"
};

router.get("/", async (req, res) => {
    res.json({ message: "this is the homepage" });
});
router.post("/", upload.array("productImage"), async (req, res) => {
    try {
        res.json(req.files);
    } catch (err) {
        console.error(err);
    }
});
router.post("/api/deleteAllUsers", async (req, res) => {
    try {
        User.deleteMany({}).then(data => {
            console.log("all users deleted successfully");
        });
    } catch (err) {
        console.error(err);
    }
});

router.post("/api/updateAllProducts", async (req, res) => {
    try {
        const arrayOfProducts = require("./arrayOfProducts");
        console.log(arrayOfProducts);

        Product.insertMany(arrayOfProducts).then(data => {
            console.log("new products inserted successfully");
            res.send("new updated products inserted successfully");
        });
    } catch (err) {
        console.error(err);
    }
});
router.post("/api/updateProductsImage", async (req, res) => {
    try {
        const newImage = "https://via.placeholder.com/300x300";

        Product.updateMany(
            {},
            {
                $set: {
                    productImage: newImage
                }
            }
        ).then(data => {
            console.log(" products images updated successfully");
            res.send(" products images updated successfully");
        });
    } catch (err) {
        console.error(err);
    }
});
router.post("/api/updateProductsCategory", async (req, res) => {
    try {
        await Product.updateMany(
            {
                $or: [{ category: "Books" }, { category: "Stationery" }]
            },
            {
                $set: {
                    category: "Books & Stationery"
                }
            }
        );
        await Product.updateMany(
            { category: "Clothing" },
            {
                $set: {
                    category: "Clothing & Accessories"
                }
            }
        );
        await Product.updateMany(
            { category: "Home & Living" },
            {
                $set: {
                    category: "Home & Kitchen"
                }
            }
        );
    } catch (err) {
        console.error(err);
    }
});

router.get("/api/getAllProducts", async (req, res) => {
    try {
        const products = await Product.find({}, { _id: 0 }).sort({
            category: -1,
            name: 1
        });
        res.json({ products });
    } catch (err) {
        console.error(err);
    }
});

router.get("/dashboard", async (req, res) => {
    try {
        if (!req.session.userId) {
            // req.flash(
            //     "error",
            //     "you must be signed in to access your vendor dashboard"
            // );
            return res.redirect("/login");
        } else if (req.session.role !== "vendor") {
            console.log("role", req.session.role);
            //req.flash("error", "you are not authorized to access this page");
            return res.redirect("/");
        }

        const currentUser = await User.findById(req.session.userId).lean();
        console.log("currentUser", currentUser);
        if (!currentUser) {
            return res.status(404).json({ message: "user not found" });
        }

        const currentUserProducts = await Product.find({
            vendorId: currentUser._id
        });
        console.log("currentUserProducts", currentUserProducts);

        res.render("vendor/dashboard", {
            locals,
            currentUser,
            categories,
            currentUserProducts
        });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
