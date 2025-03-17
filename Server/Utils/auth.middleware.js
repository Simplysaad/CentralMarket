let jwt = require("jsonwebtoken");
let secretKey = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.status(403).json({
                success: false,
                message: "invalid token",
                advice: "login first"
            });
            // res.redirect("/auth/login");
        }
        let decoded = jwt.verify(token, secretKey);
        // req.session.userId = decoded.userId;

        next();
    } catch (err) {
        console.error(err);
    }
};

module.exports = { authMiddleware };
