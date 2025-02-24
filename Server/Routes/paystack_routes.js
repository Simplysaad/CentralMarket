/** @format */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fetch = require("node-fetch");

// Import necessary models
const Product = require("../Models/Product.js");
const User = require("../Models/User.js");
const Order = require("../Models/Order.js");

/** Sends an email using a predefined template.
 * @param {string} subject - The subject of the email.
 * @param {string} recipient - The recipient's email address.
 * @param {string} template - The path to the mail template ejs file
 * @param {object} data - The data to be rendered in the email template.
 * @param {string} text - The plain text version of the email.
 *
 * @returns {Promise<void>}
 */
const { sendMessage } = require("../Utils/helper.js");
const dirtyRegex = /[</\\>&;//]/gi;

router.post("/order/place", async (req, res) => {
    try {
        // Get cart from session
        let cart = req.session.cart;

        // Calculate cart total
        const CART_TOTAL = cart.reduce(
            (acc, item) => acc + Number(item.price),
            0
        );
        // Calculate tax and shipping costs
        //const tax = CART_TOTAL * 0.02;
        const getShippingCost = price => {
            let shippingCost;
            if (price <= 2000) {
                shippingCost = 0.1 * price;
            } else if (price <= 12000 && price > 2000) shippingCost = 760;
            else if (price > 12000) shippingCost = 1000;
            else shippingCost = 1500;

            return shippingCost;
        };

        const shippingCost = getShippingCost(CART_TOTAL);
        const totalCost = CART_TOTAL + shippingCost;

        // Create new order object
        const newOrder = new Order({
            customerId: req.session.userId,
            items: req.session.cart,
            subTotal: CART_TOTAL,
            shippingCost,
            totalCost
        });

        // Save new order
        newOrder
            .save()
            .then(data => {
                console.log({
                    message: "new Order added successfully",
                    data
                });
                res.redirect("/");
            })
            .catch(err => {
                console.error("Error saving order:", err); // More specific error message
                res.status(502).redirect("/502");
                throw new Error(err);
            });
        // Reset cart
        req.session.cart = [];
    } catch (err) {
        console.error("Error in order/place route:", err);
        res.status(502).redirect("/502");
    }
});
router.get("/banks", async (req, res) => {
    try {
        let response = await fetch(
            "https://api.paystack.co/bank?currency=NGN",
            {}
        );
        console.log(response);
    } catch (err) {
        console.error(err);
    }
});
