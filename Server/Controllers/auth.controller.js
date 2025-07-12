const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../Utils/cloudinary.js");

const User = require("../Models/user.model.js");

const locals = {
    title: "Auth | CentralMarket",
    description: "",
    image: "/IMG/favicon.jpg",
    keywords: []
};
function generate_random_color() {
    let color = "#";
    let characters = "0123456789ABCDEF";

    for (let i = 0; i < 6; i++) {
        color += characters[Math.floor(Math.random() * 16)];
    }
    console.log(color);
    return color;
}

exports.getAuth = async (req, res, next) => {
    try {
        res.status(200).render("Pages/Auth/auth", { locals });
    } catch (err) {
        console.error(err);
    }
};
exports.getLogin = async (req, res, next) => {
    try {
        res.status(200).render("Pages/Auth/login", { locals });
    } catch (err) {
        console.error(err);
    }
};
exports.postLogin = async (req, res, next) => {
    try {
        req.session.trialCount = req.session.trialCount ?? 0;
        let { emailAddress, password } = req.body;
        let currentUser = await User.findOne({
            "authentication.emailAddress": emailAddress
        }).select("_id authentication");

        if (!currentUser) {
            req.session.trialCount += 1;
            return res.status(404).json({
                success: false,
                message: "user does not exist", //"Incorrect credentials", same as password for security
                advice: "check your email address and try again"
            });
        }
        console.log(currentUser);
        let isPasswordCorrect = await bcrypt.compare(
            password,
            currentUser.authentication.password
        );
        if (!isPasswordCorrect) {
            req.session.trialCount += 1;
            return res.status(403).json({
                success: false,
                message: "incorrect credentials",
                advice: "check your password and try again"
            });
        }
        let token = jwt.sign(
            { currentUserId: currentUser._id },
            process.env.SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );
        res.cookie("token", token);

        console.log(req.cookies);

        req.session.currentUserId = currentUser._id;
        // return res.redirect(req.session.returnTo);
        return res.status(200).json({
            success: true,
            message: "user has logged in successfully",
            currentUser,
            advice: ""
        });
    } catch (err) {
        next(err);
    }
};

exports.getRegister = async (req, res, next) => {
    try {
        res.status(200).render("Pages/Auth/register", { locals });
    } catch (err) {
        console.error(err);
    }
};
exports.postRegister = async (req, res, next) => {
    try {
        const { emailAddress, password, role, phoneNumber } = req.body;
        const { name, birthDate, gender } = req.body;

        const { checkEmail } = req.query;
        // let isUserExist = false; //true
        let isUserExist = await User.findOne({
            "authentication.emailAddress": emailAddress
        });

        if (!!isUserExist) {
            return res.status(403).json({
                success: false,
                isUserExist: !!isUserExist,
                message: "email address already exists",
                advice: "try logging into your account or use another email"
            });
        } else {
            if (!!checkEmail)
                return res.status(200).json({
                    success: true,
                    message: "email address available",
                    advice: "You're good to go"
                });
        }

        let salt = 10;
        let hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        let { address_1, address_2, state, school_name, address_type } =
            req.body;

        let address = {
            street: address_1 + "_" + address_2,
            school_name,
            type: address_type,
            state
        };
        // console.log(req);
        let profileImage;
        let profile_color = generate_random_color();

        if (req.file) {
            const cloudinary_response = await cloudinary.uploader.upload(
                req.file.path,
                {
                    aspect_ratio: "1:1",
                    width: 400,
                    crop: "limit",
                    folder: "users"
                }
            );
            profileImage = cloudinary_response.secure_url;
        } else
            profileImage = `https://placehold.co/400/${
                profile_color + "ff"
            }/#000?text=${req.body.name[0].toUpperCase()}`;

        console.log(req.body);

        let newUser = new User({
            authentication: {
                emailAddress,
                password: hashedPassword,
                role
            },
            demographics: {
                name,
                birthDate,
                gender,
                profileImage
            },
            addresses: [address ?? null]
            // coverImage: `https://placehold.co/600x200/${
            //     profile_color + "00"
            // }/#fff?text=CentralMarket`
        });

        await newUser.save();

        let token = jwt.sign(
            { currentUserId: newUser._id },
            process.env.SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );
        res.cookie("token", token);

        console.log(req.cookies);

        req.session.currentUserId = newUser._id;

        //should go to homepage after signup
        return res.status(200).json({
            success: true,
            message: "user registered successfully",
            token,
            newUser,
            advice: ""
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "internal server error",
            advice: "please try again later",
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: false,
    port: 587,
    // auth: {
    //     user: "maddison53@ethereal.email",
    //     pass: "jn7jnAPss4f63QBp6D"
    // },
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

exports.getResetPasswordLink = async (req, res, next) => {
    try {
        let { emailAddress } = req.body;
        let token = jwt.sign({ emailAddress }, process.env.SECRET_KEY);
        let reset_link = `http://localhost:8000/reset-password?token=${token}`;

        let info = await transporter.sendMail({
            from: "CentralMarket",
            to: emailAddress,
            subject: "Password Reset",
            html: `<p>There was an attempt to reset your password, ignore if this was not you</p><br><a href=${reset_link}> click to reset </a>`
        });

        return res.status(200).json({
            token,
            info
        });
    } catch (err) {
        console.error(err);
    }
};
exports.getResetPassword = async (req, res, next) => {
    try {
        return res
            .status(200)
            .selnd("use api tester instead to send 'POST' request directly");
    } catch (err) {
        console.error(err);
    }
};
exports.putResetPassword = async (req, res, next) => {
    try {
        let { token } = req.query;
        let user = jwt.verify(token, process.env.SECRET_KEY);

        console.log("user", user);

        let { emailAddress } = user;
        let { password } = req.body;

        let hashedPassword = await bcrypt.hash(password, 10);

        let currentUser = await User.findOneAndUpdate(
            { emailAddress },
            {
                $set: {
                    password: hashedPassword
                }
            },
            { new: true }
        );
        //res.redirect("/auth/login")
        return res.status(201).json({
            success: true,
            currentUser,
            message: "nothing to see here"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "internal server error",
            advice: "please try again later",
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};

exports.logout = async (req, res, next) => {
    try {
        req.session.destroy();
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "user logged out successfully",
            advice: ""
        });
    } catch (err) {
        console.error(err);
    }
};
