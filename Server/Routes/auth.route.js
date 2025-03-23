const express = require("express");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "./Uploads" });

const router = express.Router();
const User = require("../Models/user.model.js");
const {
    login,
    logout,
    register,
    putResetPassword,
    //resetPassword,
    getResetPasswordLink
} = require("../Controllers/auth.controller.js");


let secretKey = process.env.SECRET_KEY;

router.post("/login", login);
router.post("/register", upload.single("profileImage"), register);

router.post("/reset-password", getResetPasswordLink);
router.put("/reset-password", putResetPassword);

router.post("/logout", logout);
module.exports = router;
