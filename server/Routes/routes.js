// "axios": "^1.7.7",

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const expressFileUpload = require("express-fileupload");
const imgur = require("imgur");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: "./Public/uploads/",
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
    //,storage: multer.memoryStorage()
});
const upload = multer({
    storage: storage
});

//const controller = require("../Controllers/controller");
const product = require("../Models/Product.js");
const user = require("../Models/User.js");
const order = require("../Models/Order.js");

const locals = {
    title: "",
    description: "",
    imageUrl: "",
    emailError: ""
};

const products = require("../dummyData");
const categories = [
    "electronics",
    "Fashion",
    "health and wellness",
    "home and kitchen",
    "sports and outdoors",
    "books",
    "travel and leisure",
    "office supplies",
    "automotive"
];
router.get("/", async (req, res) => {
    try {
        //res.render("Pages/index", {
        res.render("Pages/formTest", {
            locals,
            products: products,
            categories: categories
        });
    } catch (err) {
        console.error(err);
    }
});
router.get("/register", (req, res) => {
    res.render("Pages/register", { locals });
});
router.post("/register", async (req, res) => {
    try {
        req.body.password = bcrypt.hash(password, 10);

        if (!req.body) {
            res.status(400).json({ message: "cannot add user" });
        }
        let newUser = new user(req.body);
        res.json(newUser);
        if (!newUser) {
            throw new Error(
                "cannot save user, check the request and try again"
            );
        }
        await newUser.save();
    } catch (err) {
        //res.json(err)
    }
});

/**
 * POST -validate
 * check if email address exists already
 */

router.post("/validate", async (req, res) => {
    try {
        const { emailAddress } = req.body;

        let findUser = await user.findOne({
            emailAddress: emailAddress
        });
        console.log(findUser);
        if (findUser) {
            return res.json({
                exists: true,
                message: "email already exists"
            });
        } else {
            return res.json({
                exists: false,
                message: "email is available"
            });
        }
    } catch (err) {
        console.error(err);
    }
});

router.get("/login", (req, res) => {
    res.render("pages/register");
});
router.post("/login", async (req, res) => {
    try {
        let { emailAddress, password } = req.body;
        if (!emailAddress || !password) {
            res.status(401).json({ message: "invalid request" });
        }

        let currentUser = await user.findOne({ emailAddress: emailAddress });
        if (!currentUser) {
            res.status(401).json({ message: "invalid username" });
        }

        let isValidPassword = await bcrypt.compare(
            currentUser.password,
            password
        );
        if (!isValidPassword) {
            res.status(401).json({ message: "invalid password" });
        }
        if (currentUser.role === "customer") {
            res.redirect("/cart");
        }
        if (currentUser.role === "vendor") {
            res.redirect("/dashboard");
        }
    } catch (err) {}
});

router.post("/upload-image", upload.single("uploadFile"), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("no file uploaded");
        }
        // let filename = req.file.filename;
        // let originalname = req.file.originalname;
        let uploadPath = req.file.path;

        const data = new formData();
        data.append("uploadFile", req.file.buffer, req.file.originalname);

        let response = await fetch("https://api.imgur.com/3/upload", {
            method: "POST",
            headers: {
                "Content-Type": "image/jpg",
                "Authorization": "client-ID e2b328ad29f2fa8"
            },
            body: data
        });
        const jsonResponse = await response.json();

        if (response.status !== 200) {
            throw new Error(
                `Imgur API Error: ${response.status} - ${jsonResponse.data.error}`
            );
        }

        res.send(jsonResponse);
    } catch (err) {
        console.error(err);
    }
});

// router.post(
//     "/upload-image",
//     //upload.single("uploadFile"),
//     //uploadFile is the name of the input:file field
//     async (req, res) => {
//         let uploadFile = req.files.uploadFile;
//         //let uploadName = Date.now() + uploadFile.name
//         let uploadPath = __dirname + "./uploads/" + uploadFile.name;

//         uploadFile.mv(uploadPath, err => {
//             if (err) {
//                 throw new Error("could not upload file");
//             }
//         });

//         imgur.uploadFile(uploadPath).then(urlObject => {
//             fs.unlinkSync(uploadPath);
//             res.send(urlObject);
//         });
//     }
// );

// router.post("/upload-image", upload.single("uploadFile"), async (req, res) => {
//     let uploadFile = req.files.uploadFile;
//     let uploadPath = __dirname + "./uploads/" + uploadFile.name;

//     const response = await client.upload({
//         image: createReadStream(uploadPath),
//         type: "stream"
//     });
//     res.send(response);
// });

// const { ImgurClient } = require("imgur");
// const client = new ImgurClient({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET
//     //,refreshToken: process.env.REFRESH_TOKEN
// });
// router.post("/upload-image", upload.single("uploadFile"), async (req, res) => {
//     try {
//         let uploadFile = req.file;
//         let uploadPath = __dirname + "/uploads/" + uploadFile.originalname;
//         console.log(uploadFile, uploadPath)

//         let response = await client.upload({
//             image: uploadFile,
//             type: "base64",
//             name: Date.now() + uploadFile.originalName,
//             description: "Uploaded with express"
//         });
//         res.send(response);
//     } catch (err) {
//         console.error(err);
//     }
// });

module.exports = router;
