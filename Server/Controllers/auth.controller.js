const login = async (req, res) => {
    try {
        req.session.trialCount = 0;
        let { emailAddress, password } = req.body;
        // let isUserExist = true;
        await User.findOne({ emailAddress }).select(
            "_id emailAddress password role"
        );
        if (!isUserExist) {
            req.session.trialCount += 1;
            return res.status(403).json({
                success: false,
                message: "user does not exist", //"Incorrect credentials", same as password for security
                advice: "check your email address and try again"
            });
        }
        //let hashedPassword = await bcrypt.hash(password, 10);
        let isPasswordCorrect = await bcrypt.compare(
            password,
            //hashedPassword
            isUserExist.password
        );
        if (!isPasswordCorrect || !password) {
            req.session.trialCount += 1;
            return res.status(403).json({
                success: false,
                message: "incorrect credentials",
                advice: "check your password and try again"
            });
        }
        let token = jwt.sign({ userId: "saadidris70" }, secretKey, {
            expiresIn: "1d"
        });
        req.cookie("token", token);
        req.session.userId = isUserExist._id;
        return res.status(200).json({
            success: true,
            message: "user has logged in successfully",
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
const register = async (req, res) => {
    try {
        const { emailAddress, password, role } = req.body;
        // let isUserExist = false; //true
        let isUserExist = await User.findOne({ emailAddress });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                message: "email address already exists",
                advice: "try logging into your account or use another email"
            });
        }
        let salt = 10;
        let hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        let newUser = new User({
            ...req.body
        });

        await newUser.save();
        //let { emailAddress, password, role } = req.body;
        //let { emailAddress, password, role } = newUser;

        let token = jwt.sign({ emailAddress, password, role }, secretKey, {
            expiresIn: "1d"
        });

        req.cookie("token", token);
        req.session.userId = newUser._id;

        return res.status(200).json({
            success: true,
            message: "user registered successfully",
            token,
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
const resetPassword = async (req, res) => {
    try {
        console.log({ req });
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

module.exports = {
    login,
    register,
    resetPassword
};
