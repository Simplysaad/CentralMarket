const authMiddleware = (req, res, next) => {
    const originalUrl = req.originalUrl
    req.session.returnTo = originalUrl
    
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect("/auth/login");
    }
};

module.exports = authMiddleware