/** @format */
import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

/**
 * Sends an email using a predefined template.
 *
 * @param {string} subject - The subject of the email.
 * @param {string} recipient - The recipient's email address.
 * @param {string} template - The path to the mail template ejs file
 * @param {object} data - The data to be rendered in the email template.
 * @param {string} text - The plain text version of the email.
 *
 * @returns {Promise<void>}
 */
const sendMessage = async (subject, recipient, template, data, text) => {
    try {
        const htmlFile = await ejs.renderFile(
            template || "../../Views/Pages/mail-template.ejs",
            data
        );

        const mailOptions = {
            from: process.env.GMAIL_USER,
            bcc: [recipient],
            subject,
            text,
            html: htmlFile
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email Sent", info);
    } catch (err) {
        console.error(err);
    }
};
