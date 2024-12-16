const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");

router.use((req, res, next) => {
    res.locals.layout = "Layouts/authLayout";
    next();
});
let errorMessage; // = "enter correct details";
router.get("/register", async (req, res) => {
    try {
        res.render("Auth/register");
    } catch (err) {
        console.error(err);
    }
});

router.post("/register", async (req, res) => {
    try {
        if (!req.body) {
            return res.json({
                success: false,
                errorMessage: "Please enter into all fields"
            });
        }
        //console.log("reqBody", req.body);

        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { emailAddress } = req.body;
        let isEmailExist = User.findOne({ emailAddress }, { _id: 1 });

        if (isEmailExist)
            return res.json({
                success: false,
                errorMessage: "Email address already exists"
            });

        const newUser = new User({ ...req.body, password: hashedPassword });
        newUser
            .save()
            .then(data => {
                console.log(data, "user registered successfully");
            })
            .catch(err => {
                console.error(err, "trouble encountered while adding new user");
                res.status(500).json(err);
            });

        req.session.userId = newUser._id;
        req.session.role = newUser.role;
        req.session.username = newUser.usernamename;

        let returnTo = req.session.returnTo || "/cart";
        res.redirect(returnTo);
    } catch (err) {
        console.error(err);
    }
});

router.get("/login", async (req, res) => {
    try {
        res.render("Auth/login", { errorMessage: req.session.errorMessage });
        req.session.errorMessage = "";
    } catch (err) {
        console.error(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        if (!req.body)
            return res.json({
                success: false,
                errorMessage: "Please Enter Username and password"
            });
        const { username, password } = req.body;
        let trimmedUsername = username.trim();
        let regex = new RegExp(trimmedUsername, "gi");

        const currentUser = await User.findOne({
            $or: [{ username: regex }, { emailAddress: regex }]
        });

        if (!currentUser) {
            return res.json({
                success: false,
                errorMessage: "Incorrect username or password"
            });
        }

        const isCorrectPassword = await bcrypt.compare(
            password,
            currentUser.password
        );

        if (!isCorrectPassword) {
            return res.json({
                success: false,
                errorMessage: "Incorrect username or password"
            });
        }

        //console.log(currentUser);
        req.session.userId = currentUser._id;
        req.session.username = currentUser.username;
        req.session.role = currentUser.role;

        let returnTo = req.session.returnTo || "/";

        if (currentUser.role === "vendor") {
            returnTo = req.session.returnTo || "/vendor/dashboard";
        }
        // console.log("user logged in successfully");

        res.redirect(returnTo);
    } catch (err) {
        console.error(err);
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            console.log("user logged out successfully");
            res.redirect("auth/login");
        }
    });
});

module.exports = router;
