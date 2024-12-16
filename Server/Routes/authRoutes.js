const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");

router.use((req, res, next) => {
    res.locals.layout = "Layouts/authLayout";
    next();
});
let errorMessage;
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
            return res.redirect("/register");
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
        const errorMessage = "Incorrect username or password";

        if (req.session && req.session.userId) {
            //console.log("user is logged in");
            res.redirect("/auth/logout");
        } else {
            res.render("Auth/login", {errorMessage});
        }
    } catch (err) {
        console.error(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        let trimmedUsername = username.trim();
        let regex = new RegExp(trimmedUsername, "gi");

        const currentUser = await User.findOne({
            $or: [{ username: regex }, { emailAddress: regex }]
        });

         errorMessage = "Incorrect username or password";

        if (!currentUser) {
            return res.render("Auth/login", { errorMessage });
        }

        const isCorrectPassword = await bcrypt.compare(
            password,
            currentUser.password
        );

        if (!isCorrectPassword) {
            return res.render("Auth/login", { errorMessage });
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
            //console.log("user logged out successfully");
            res.render("Auth/login", {errorMessage});
        }
    });
    //res.flash({ info: "user logged out successfully" });
});

module.exports = router;
