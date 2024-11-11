const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: "./Public/Uploads/",
    filename: function (req, file, cb) {
        let myFileName =
            Math.round(Math.random() * 100372600) +
            "_" +
            file.originalname +
            "_" +
            Date.now() +
            ".jpg";
        cb(null, myFileName);
    }
});
const upload = multer({
    storage: storage
});

const Product = require("../Models/Product.js");
const User = require("../Models/User.js");
const Order = require("../Models/Order.js");

const helper = require("../.././utils/helper.js");
const relatedProductsFunc = helper.relatedProductsFunc;

const locals = {
    title: "Campus Mart",
    description:
        "an incampus shopping website for school online vendors and students, to buy , sell and deliver items without hassle",
    imageUrl: "/IMG/favicon.png"
};


router.get("/login", async(req, res)=>{})
router.post("/login", async(req, res)=>{})

router.get("/register", async(req, res)=>{})
router.post("/register", async(req, res)=>{})

router.get("/dashboard", async(req, res)=>{})

router.get("/add-product", async(req, res)=>{})
router.post("/add-product", async(req, res)=>{})

router.get("/edit-product", async(req, res)=>{})
router.post("/edit-product", async(req, res)=>{})

router.get("/place-ad", async(req, res)=>{})
router.post("/place-ad", async(req, res)=>{})

