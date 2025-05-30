const express = require("express");

const cors = require("cors");

const expressLayouts = require("express-ejs-layouts");

const dotenv = require("dotenv");
dotenv.config();

const mongoStore = require("connect-mongo");
const session = require("express-session");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
//const expressFileUpload = require("express-file-upload");

const connectDB = require("./Config/db.js");
const errorHandler = require("./Server/Utils/error.middleware.js");

const PORT = process.env.PORT;

const app = express();

app.listen(PORT, (err, info) => {
    if (!err) {
        connectDB();
        console.log(`server is started at  http://localhost:${PORT}`);
    } else {
        console.error(err);
    }
});
app.use(
    cors({
        origin: "http://localhost:8000",
        credentials: true
    })
);
app.use(errorHandler);

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
app.locals.categories = [
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
app.use(expressLayouts);

app.use(express.static("./Public"));
app.set("view engine", "ejs");
app.set("views", "./Views");
app.set("layout", "Layouts/customer_layout.ejs");

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
app.use("/vendor", require("./Server/Routes/vendor.route.js"));
app.use("/auth", require("./Server/Routes/auth.route.js"));
app.use("/account", require("./Server/Routes/account.route.js"));
app.use("/api", require("./Server/Routes/api.route.js"));
app.use("/", require("./Server/Routes/main.route.js"));
