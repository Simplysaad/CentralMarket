const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const User = require("../Models/user.model.js");
const locals = {
    title: "Auth | CentralMarket",
    description: "",
    image: "/IMG/favicon.jpg",
    keywords: [],
    categories: [
        "study materials",
        "electronics",
        "hostel essentials",
        "clothing and accessories",
        "groceries and snacks",
        "health and personal care",
        "events and experiences",
        "secondhand marketplace",
        "services",
        "hobbies and entertainment",
        "gifts and handmade goods"
    ]
};
const categories = [
    "study materials",
    "electronics",
    "hostel essentials",
    "clothing and accessories",
    "groceries and snacks",
    "health and personal care",
    "events and experiences",
    "secondhand marketplace",
    "services",
    "hobbies and entertainment",
    "gifts and handmade goods"
];
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
        req.session.trialCount = 0;
        let { emailAddress, password } = req.body;
        let currentUser = await User.findOne({ emailAddress }).select(
            "_id name business emailAddress wishlist password role"
        );
        if (!currentUser) {
            req.session.trialCount += 1;
            return res.status(404).json({
                success: false,
                message: "user does not exist", //"Incorrect credentials", same as password for security
                advice: "check your email address and try again"
            });
        }
        let isPasswordCorrect = await bcrypt.compare(
            password,
            currentUser.password
        );
        if (!isPasswordCorrect || !password) {
            req.session.trialCount += 1;
            return res.status(403).json({
                success: false,
                message: "incorrect credentials",
                advice: "check your password and try again"
            });
        }
        let token = jwt.sign({ currentUser }, process.env.SECRET_KEY, {
            expiresIn: "1d"
        });
        res.cookie("token", token);

        console.log(req.cookies);

        // req.session.userId = currentUser._id;
        //let { pass, ...formatted_user } = currentUser;
        req.session.currentUser = currentUser;

        return res.status(200).json({
            success: true,
            message: "user has logged in successfully",
            currentUser,
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

exports.getRegister = async (req, res, next) => {
    try {
        res.status(200).render("Pages/Auth/register", { locals });
    } catch (err) {
        console.error(err);
    }
};
exports.postRegister = async (req, res, next) => {
    try {
        const { emailAddress, password, role } = req.body;
        const { checkEmail } = req.query;
        // let isUserExist = false; //true
        let isUserExist = await User.findOne({ emailAddress });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                message: "email address already exists",
                advice: "try logging into your account or use another email"
            });
        }else{
          if (!!checkEmail) return res.status(400).json({
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
            address: address_1 + "_" + address_2,
            school: school_name,
            address_type,
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

        let newUser = new User({
            ...req.body,
            address,
            role: "admin",
            //this is supposed to come from the form but i've not added a field to the form yet
            profileImage,
            coverImage: `https://placehold.co/600x200/${
                profile_color + "00"
            }/#fff?text=${req.body.businessName || "CentralMarket"}&color=`
        });

        await newUser.save();
        //let { emailAddress, password, role } = req.body;
        //let { emailAddress, password, role } = newUser;

        let token = jwt.sign(currentUser, process.env.SECRET_KEY, {
            expiresIn: "1d"
        });
        res.cookie("token", token);

        //currentUser = { ...newUser, password };
        //req.session.userid = newUser._id;
        req.session.currentUser = newUser;

        //should go to homepage after signup
        return res.status(200).json({
            success: true,
            message: "user registered successfully",
            token,
            newUser,
            request: req.body,
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
    //host: "smtp.ethereal.email",
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
