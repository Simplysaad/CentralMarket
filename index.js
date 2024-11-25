const express = require("express");
const expressLayout = require("express-ejs-layouts");
const ejs = require("ejs");

const morgan = require("morgan");
app.use(morgan("tiny"))


const dotenv = require("dotenv");
dotenv.config();

const flash = require("express-flash")
app.use(flash())

const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const connectDB = require("./Server/Config/db.js")

const authMiddleware = require("./Server/Utils/auth")
const app = express();

const PORT = process.env.PORT
app.listen(PORT, (err)=>{
  if(!err){
    console.log(`app listening on port ${PORT}, at ${process.env.ADDRESS}${PORT}`)
  }
  connectDB()
})


app.use(cookieParser());
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

//SETUP VIEW ENGINE
app.set("view engine", "ejs")
app.set("views", "Views")

//LOAD STATIC FILES
app.use(express.static("PUBLIC"))

//req.body PARSER TO JSOM
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//SET LAYOUT
app.use(expressLayout)
app.set("layout", "Layouts/mainLayout")

//SECONDARY ROUTING
app.use("/vendor", require("./Server/Routes/vendorRoutes"))
app.use("/auth", require("./Server/Routes/authRoutes"))
app.use("/", require("./Server/Routes/mainRoutes"))