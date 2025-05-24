const express = require("express");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "./Uploads/Users/" });

const router = express.Router();
const User = require("../Models/user.model.js");
const authController = require("../Controllers/auth.controller.js");

let secretKey = process.env.SECRET_KEY;

const locals = {
    title: "Auth | CentralMarket",
    description: "",
    image: "/IMG/favicon.jpg",
    keywords: []
};

router.get("/", authController.getAuth);

router.post("/login", authController.postLogin);
router.get("/login", authController.getLogin);

router.get("/register", authController.getRegister);
router.post(
    "/register",
    upload.single("profileImage"),
    authController.postRegister
);

router.post("/reset-password", authController.getResetPasswordLink);
router.put("/reset-password", authController.putResetPassword);

router.post("/logout", authController.logout);
module.exports = router;
