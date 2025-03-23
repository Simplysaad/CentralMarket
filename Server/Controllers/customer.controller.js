const Product = require("../Models/product.model.js");
const Search = require("../Models/search.model.js");

let searchController = async (req, res) => {
    try {
        const dirtyRegex = /[</\\>&;//]/gi;

        // Extract search term from query or body (handle both GET and POST)
        // Sanitize and trim search term to prevent injection
        let searchTerm = (req.body.searchTerm || req.query.searchTerm)
            ?.toLowerCase()
            .replace(dirtyRegex, " ")
            .trim();

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

        // Create regex for case-insensitive search
        let regex = new RegExp(searchTerm, "gi");

        // Search for products based on various fields using the regex
        // const searchResults = await Product.aggregate([
        //     {
        //         $search: {
        //             autocomplete: {
        //                 query: searchTerm,
        //                 path: "title",
        //                 fuzzy: {
        //                     maxEdits: 1,
        //                     prefixLength: 2
        //                 }
        //             }
        //         }
        //     },
        //       {
        //         $project: {
        //           name: 1,
        //           price: 1,
        //           // averageRating: -1,
        //           // addToCartCount: -1
        //         }
        //       }
        // ]);
        // const searchResults = await Product.find({
        //     $text: { $search: searchTerm }
        // });
        const searchResults = await Product.find({
            $or: [
                { name: regex },
                { description: regex },
                { category: regex },
                { keywords: regex }
            ]
        })
            .sort({ interests: -1 })
            .limit(20)
            .select("_id name imageUrl category")
            .lean();
        // Handle empty search results
        if (searchResults.length === 0) {
            console.log(searchTerm, "brought no results ");
            return res.status(204).json({
                success: true,
                message: "empty search", //"Incorrect credentials", same as password for security
                advice: "seems we can't find what you seek! please try again later"
            });
        }

        let items = [];
        searchResults.forEach((item, index) => {
            let {_id: productId,  name, imageUrl, category} = item
            let newItem = { productId,  name, imageUrl, category}
            items.push(newItem);
            console.log(newItem);
        });

        console.log(items);
        // Create and save new search record
        const newSearch = new Search({
            userId, // Store userId, if available
            searchTerm,
            items
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
};
module.exports = {
    searchController
};
