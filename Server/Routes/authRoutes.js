/** @format */

const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");

router.use((req, res, next) => {
    res.locals.layout = "Layouts/authLayout";
    next();
});

const locals = {
    title: "Auth | CentralMarket",
    description:
        "an incampus shopping website for school online vendors and students, to buy , sell and deliver items without hassle",
    imageUrl: "/IMG/favicon.png"
};

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
        console.log("reqBody", req.body);
        const { emailAddress } = req.body;
        console.log("emailAddress", emailAddress);

        let isEmailExist = await User.findOne({ emailAddress }, { _id: 1 });
        console.log("isEmailExist", isEmailExist);

        if (isEmailExist) {
            return res.json({
                success: false,
                errorMessage: "Email address already exists"
            });
        }

        const { password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { username } = req.body;
        const newUsername = username.trim().toLowerCase();

        const newUser = new User({
            ...req.body,
            username: newUsername,
            password: hashedPassword
        });
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
        req.session.username = newUser.username;

        let returnTo = req.session.returnTo || "/cart";

        return res.json({
            success: true,
            errorMessage: "",
            redirect: returnTo
        });
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
        if (!req.body) {
            return res.json({
                success: false,
                errorMessage: "Please Enter Username and password"
            });
        }
        const { username, password } = req.body;

        const trimmedUsername = username.trim().toLowerCase();
        const currentUser = await User.findOne({
            $or: [
                { username: trimmedUsername },
                { emailAddress: trimmedUsername }
            ]
        });

        if (!currentUser) {
            return res.json({
                success: false,
                errorMessage: "Incorrect Username"
            });
        }

        const isCorrectPassword = await bcrypt.compare(
            password,
            currentUser.password
        );

        if (!isCorrectPassword) {
            console.log(currentUser);
            return res.json({
                success: false,
                errorMessage: "Incorrect Password"
            });
        } else {
            req.session.userId = currentUser._id;
            req.session.username = currentUser.username;
            req.session.role = currentUser.role;

            let returnTo = req.session.returnTo || "/";

            if (currentUser.role === "vendor") {
                returnTo = req.session.returnTo || "/vendor/dashboard";
            }

            return res.json({
                success: true,
                errorMessage: "",
                redirect: returnTo
            });
        }
    } catch (err) {
        console.error(err);
    }
});

router.get("/reset-password", async (req, res) => {
    try {
    } catch (err) {
        console.error(err);
    }
});
router.post("/reset-password", async (req, res) => {
    try {
        const { password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const currentUser = await User.updateOne(
            {
                _id: req.params.id
            },
            {
                $set: {
                    password: hashedPassword
                }
            },
            {
                new: true
            }
        );
    } catch (err) {
        console.error(err);
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            console.log("user logged out successfully");
            res.redirect("/auth/login");
        }
    });
});

module.exports = router;
