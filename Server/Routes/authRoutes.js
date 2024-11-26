const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");

router.use((req, res, next) => {
    res.locals.layout = "Layouts/authLayout";
    next();
});

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
            console.log("reqBody cannot be empty");
        }
        //console.log("reqBody", req.body);

        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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

        res.redirect("/vendor/dashboard");
    } catch (err) {
        console.error(err);
    }
});

router.get("/login", async (req, res) => {
    try {
        if (req.session && req.session.userId) {
            req.flash("info", "user logged out successfully");
            res.redirect("/auth/logout");
        } else {
            res.render("Auth/login");
        }
    } catch (err) {
        console.error(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const currentUser = await User.findOne({
            $or: [{ username: username }, { emailAddress: username }]
        });

        if (!currentUser) {
            return res.json({ errorMessage: "user not found" });
        }

        const isCorrectPassword = await bcrypt.compare(
            password,
            currentUser.password
        );

        if (!isCorrectPassword) {
            return res.json({ errorMessage: "incorrect credentials" });
        }

        console.log(currentUser);
        req.session.userId = currentUser._id;
        req.session.username = currentUser.username;
        req.session.role = currentUser.role;

        const returnTo = req.session.returnTo || "/vendor/dashboard";

        res.redirect(returnTo);
        //res.send("/dashboard page should load instead");
    } catch (err) {
        console.error(err);
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy();
    console.log("user logged out successfully");
    res.redirect("/auth/login");
    //res.json({ message: "user logged out successfully" });
});

module.exports = router;
