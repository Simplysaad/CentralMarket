const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");
const Product = require("../Models/Product.js");

const authMiddleware = require("../Utils/auth.js");

const categoryList = Product.distinct("category").exec();
console.log(categoryList)

const multer = require("multer");
const storage = multer.diskStorage({
    destination: "Uploads/Products",
    filename: function (req, file, cb) {
        let myFileName = Date.now() + "_" + file.originalname;
        cb(null, myFileName);
    }
});
const upload = multer({
    storage: storage
});

router.use(authMiddleware);
router.get("/dashboard", async (req, res) => {
    try {
        if (!req.session.userId) {
            throw new Error("user not logged in");
            req.flash(
                "error",
                "you must be signed in to access your vendor dashboard"
            );
            return res.redirect("/login");
        } else if (req.session.role !== "vendor") {
            console.log("role", req.session.role);
            req.flash("error", "you are not authorized to access this page");
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

        res.render("Vendor/dashboard", { currentUser, currentUserProducts });
    } catch (err) {
        console.error(err);
    }
});
router.get("/add-product", async (req, res) => {
    try {
        res.render("Vendor/add_product", { categoryList });
    } catch (err) {
        console.error(err);
    }
});
router.post("/add-product", upload.single("productImage"), async (req, res) => {
    try {
        const productImage = req.file.filename;
        const newProduct = new Product({
            ...req.body,
            productImage,
            vendorId: req.session.userId
        });
        newProduct
            .save()
            .then(data => {
                console.log(data, "new product added successfully");
            })
            .catch(err => {
                res.status(500).json({
                    message: "error encountered while adding new product",
                    advice: " please try again later"
                });
                throw new Error(err);
            });
        res.redirect("/Vendor/dashboard");
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
