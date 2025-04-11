let jwt = require("jsonwebtoken");
let secretKey = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            console.log({
                success: false,
                message: "invalid token",
                advice: "login first"
            });
            return res.redirect("/auth/login");
        }
        let decoded = jwt.verify(token, secretKey);
        // req.session.userId = decoded.userId;

        next();
    } catch (err) {
        console.error(err);
    }
};

module.exports = { authMiddleware };
