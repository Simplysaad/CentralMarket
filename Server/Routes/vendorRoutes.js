const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");
const Product = require("../Models/Product.js");

const authMiddleware = require("../Utils/auth.js");
const helper = require("../Utils/helper");
const getCategories = async query => {
    categoriesPromise = await Product.distinct(query);
    //console.log("categoriesPromise()", categoriesPromise);
    return categoriesPromise;
};

var categories;
getCategories("category").then(data => {
    categories = data;
});

var subCategories;
getCategories("subCategory").then(data => {
    subCategories = data;
});

const multer = require("multer");
const storage = multer.diskStorage({
    destination: "PUBLIC/Uploads/Products",
    filename: function (req, file, cb) {
        let myFileName = Date.now() + "_" + file.originalname;
        cb(null, myFileName);
    }
});
const upload = multer({
    storage: storage
});

const locals = {
    title: "Campus Mart",
    description:
        "an incampus shopping website for school online vendors and students, to buy , sell and deliver items without hassle",
    imageUrl: "/IMG/favicon.png",
    categories
};

router.use(authMiddleware);
router.get("/dashboard", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect("/login");
        } else if (req.session.role !== "vendor") {
            console.log("role", req.session.role);
            return res.redirect("/");
        }

        const currentUser = await User.findById(req.session.userId).lean();
        console.log("currentUser", currentUser);
        if (!currentUser) {
            return res.status(404).json({ message: "user not found" });
        }

        const currentUserProducts = await Product.find({
            vendorId: currentUser._id
        }).sort({ amountSold: -1 });
        console.log("currentUserProducts", currentUserProducts);
        
        

        const totalSales = currentUserProducts.reduce((product, acc) => {
            return acc + product.price * product.amountSold;
        }, 0);
        console.log(totalSales);
        
        
        
        
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
router.get("/add-product", async (req, res) => {
    try {
        console.log("categories: ", categories);
        res.render("vendor/add_product", { locals, categories, subCategories });
    } catch (err) {
        console.error(err);
    }
});
router.post("/add-product", upload.single("productImage"), async (req, res) => {
    try {
        const { productTags, basePrice, discount } = req.body;

        const productImage = req.file.filename;

        const refinedTags = productTags.split(",");
        console.log("refinedTags", refinedTags);

        let finalPrice;
        if (discount) finalPrice = basePrice * (discount / 100);
        else finalPrice = basePrice;

        const newProduct = new Product({
            vendorId: req.session.userId,
            productImage: req.file.filename,
            tags: refinedTags,
            price: basePrice,
            name: req.body.productName,
            ...req.body
        });
        newProduct
            .save()
            .then(data => {
                res.redirect("/vendor/dashboard");
                console.log({
                    message: "new product added successfully",
                    newProduct: newProduct,
                    "req.body": req.body
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: "error encountered while adding new product",
                    advice: " please try again later"
                });
                throw new Error(err);
            });
        //res.json({ newProduct: newProduct, "req.body": req.body });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
