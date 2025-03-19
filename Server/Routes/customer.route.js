const express = require("express");
const router = express.Router();

const Product = require("../Models/product.model.js");

router.all("/search", async (req, res) => {
    try {
        const dirtyRegex = /[</\\>&;//]/gi;

        // Extract search term from query or body (handle both GET and POST)
        let { searchTerm } = req.body;
        searchTerm = searchTerm || req.query.searchTerm;

        console.log(
            "Request body:",
            req.body,
            "Request Query:",
            req.query,
            "Search Term:",
            searchTerm
        ); // More useful log

        //Get userId from session
        let { userId } = req.session;
        // Sanitize and trim search term to prevent injection
        searchTerm = searchTerm.replace(dirtyRegex, " ").trim();

        // Create regex for case-insensitive search
        let regex = new RegExp(searchTerm, "gi");

        // Search for products based on various fields using the regex
        const searchResults = await Product.find({
            $or: [
                {
                    name: regex
                },
                {
                    description: regex
                },
                {
                    keywords: regex
                },
                {
                    category: regex
                }
            ]
        });

        // Handle empty search results

        if (searchResults.length === 0) {
            console.log(searchTerm, "brought no results ");
            return res.status(200).json({
                success: true,
                message: "empty search", //"Incorrect credentials", same as password for security
                advice: "seems we can't find what you seek! please try again later"
            });
        }

        // Create and save new search record
        const newSearch = new Search({
            userId: userId || null, // Store userId, if available
            searchTerm,
            searchResults: newSearchResults
        });

        await newSearch.save().then(() => {
            console.log("Search data saved");
        });

        //locals.title = "search for " + searchTerm + " | CentralMarket"; // Update title

        // return search results page
        res.status(200).json({
            success: true,
            searchResults,
            searchTerm
        });
    } catch (err) {
        console.error("Error in search route:", err); // More specific error message
        return res.status(502).json({
            success: false,
            message: "internal server error", //"Incorrect credentials", same as password for security
            advice: "something's wrong on our end! please try again later"
        });
    }
});

module.exports = router;
