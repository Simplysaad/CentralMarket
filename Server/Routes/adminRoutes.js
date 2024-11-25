const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");

const User = require("../Models/User.js");

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

router.get("/", async(req, res)=>{
  res.json({message: "this is the homepage"})
})
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
module.exports = router;
