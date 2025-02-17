const nodemailer = require("nodemailer")
const ejs = require("ejs")
const fs = require("fs")

const dotenv = require("dotenv")
dotenv.config()


const data = {
  name: "saad idris",
  age: "20",
  school: "Obafemi Awolowo University"
}

const template = ejs.renderFile("./Test/text.ejs", data).then((htmlFile) => {
  const mailOptions = {
    // from: "saadidris23@gmail.com",
    from: process.env.GMAIL_USER,
    bcc: ["saadidris70@gmail.com", "simplysaad24@gmail.com"],
    subject: "THIS IS A TEST EMAIL",
    text: "I SENT THIS USING NODEMAILER",
    html: htmlFile
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err)
      console.error(err)
    else
      console.log("Email Sent", info)
  })
  console.log(htmlFile)
})


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  }
})

// const mailOptions = {
//   // from: "saadidris23@gmail.com",
//   from: process.env.GMAIL_USER,
//   bcc: ["saadidris70@gmail.com", "simplysaad24@gmail.com"],
//   subject: "THIS IS A TEST EMAIL",
//   text: "I SENT THIS USING NODEMAILER",
//   html: htmlFile
// }

// transporter.sendMail(mailOptions, (err, info) => {
//   if (err)
//     console.error(err)
//   else
//     console.log("Email Sent", info)
// })