const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const mongoStore = require("connect-mongo");
const session = require("express-session");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressFileUpload = require("express-fileUpload");

const connectDB = require("./Config/db.js");

const PORT = process.env.PORT;

const app = express();

app.listen(PORT, (err, info) => {
    if (!err) {
        connectDB();
        console.log(`server is started at port ${PORT}`);
    } else {
        console.error(err);
    }
});

app.use(
    session({
        store: mongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),
        secret: process.env.SECRET_KEY,
        saveUninitialized: false,
        resave: false,
        cookies: {
            maxAge: 360000,
            secure: true,
            httpOnly: true
        }
    })
);

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(morgan("tiny"));
app.use(cookieParser());
//app.use(expressFileUpload())

app.use("/admin", require("./Server/Routes/admin.route.js"));
app.use("/auth", require("./Server/Routes/auth.route.js"));
app.use("/", require("./Server/Routes/customer.route.js"));
