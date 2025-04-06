const Product = require("../Models/product.model.js");
const Search = require("../Models/search.model.js");

let atlasSearchController = async (req, res) => {
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
        const searchResults = await Product.aggregate([
            {
                $search: {
                    index: "products_index",
                    text: {
                        query: searchTerm,
                        path: ["name", "description", "keywords"]
                    }
                }
            }
        ]);
        // Handle empty search results
        if (searchResults.length === 0) {
            console.log(searchTerm, "brought no results ");
            return res.status(204).json({
                success: true,
                message: "empty search",
                advice: "seems we can't find what you seek! please try again later"
            });
        }

        let items = [];
        searchResults.forEach((item, index) => {
            let { _id: productId, name, imageUrl, category } = item;
            let newItem = { productId, name, imageUrl, category };
            items.push(newItem);
            console.log(newItem);
        });

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
                message: "empty search",
                advice: "seems we can't find what you seek! please try again later"
            });
        }

        let items = [];
        searchResults.forEach((item, index) => {
            let { _id: productId, name, imageUrl, category } = item;
            let newItem = { productId, name, imageUrl, category };
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

const postCart = async (req, res) => {
    try {
        if (!req.session.cart) req.session.cart = [];

        let { userId, cart } = req.session;
        let { id: productId } = req.params;
        let { quantity } = req.query;

        if (quantity && quantity !== "") {
            quantity = Number(quantity);
        }

        //if req.query.quantity exist, change the item quantity to req.query.quantity
        //else increment by 1

        let currentProduct = await Product.findOneAndUpdate(
            { $and: [{ _id: productId }, { available: true }] },
            {
                $inc: {
                    addToCartCount: quantity
                }
            },
            { new: true }
        );
        if (!currentProduct)
            return res.status(404).json({
                success: false,
                message: `product with id: ${productId}.does not exist or is not available`
            });

        let index = cart.findIndex(item => item.productId === productId);
        if (index === -1) {
            //TODO: implement discount calculations
            quantity = quantity || 1;

            let singleProduct = {
                name: currentProduct.name,
                price: currentProduct.price * quantity,
                unitPrice: currentProduct.price,
                quantity,
                productId
            };
            req.session.cart.push(singleProduct);

            return res.status(201).json({
                success: true,
                message: "new product added to cart",
                cart: req.session.cart
            });
        } else {
            if (quantity) {
                req.session.cart[index].quantity = quantity;
                req.session.cart[index].price = currentProduct.price * quantity;
            } else {
                req.session.cart[index].quantity += 1;
                req.session.cart[index].price =
                    currentProduct.price * req.session.cart[index].quantity;
            }

            return res.status(201).json({
                success: true,
                message: "existing product incremented successfully",
                cart: req.session.cart
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(422).json({
            success: false,
            message: "error encountered while adding product to cart "
            // ,cart: req.session.cart
        });
    }
};
const deleteCartItem = async (req, res) => {
    try {
        let { userId, cart } = req.session;
        let { id: productId } = req.params;
        let { quantity, removeAll } = req.query;

        if (quantity && quantity !== "") {
            quantity = Number(quantity);
        }

        let currentProduct = await Product.findOne({ _id: productId }).select(
            "name _id price addToCartCount imageUrl"
        );
        if (!currentProduct)
            return res.status(404).json({
                success: false,
                message: `couldn't find a document with id ${productId}`
            });

        let index = cart.findIndex(item => item.productId === productId);
        //If productnis not in the cart
        if (index === -1)
            return res.status(404).json({
                success: false,
                message: `product with productId: ${productId} is not in cart`
            });

        //what if product is in the cart
        if (
            cart[index].quantity <= 1 ||
            removeAll ||
            quantity >= cart[index].quantity
        ) {
            //if product quantity is less than or equal to one, remove the product from cart
            req.session.cart.splice(index, 1);
            return res.status(201).json({
                success: true,
                message: `item removed successfully`,
                cart: req.session.cart
            });
        } else {
            //if the quantity of the item is more than one, then reduce by one
            req.session.cart[index].quantity -= 1;
            req.session.cart[index].price =
                currentProduct.price * req.session.cart[index].quantity;

            return res.status(201).json({
                success: true,
                message: `item quantity decremented successfully by ${quantity}`,
                cart: req.session.cart
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: `internal server error: error encountered while adding item to cart`,
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};

const getCart = async (req, res) => {
    try {
        let { cart } = req.session;

        let cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
        let cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
        let cartItemsCount = cart.length;

        return res.status(200).json({
            success: true,
            message: "cart items fetched successfully",
            cart,
            cartTotal,
            cartQuantity,
            cartItemsCount
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: `internal server error: error encountered while fetching cart items`,
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};

let getProducts = async (req, res) => {
    try {
        let products = await Product.find({ available: true }).select(
            "name _id price description"
        );
        let popularProducts = await Product.find({ available: true })
            .sort({
                amountSold: -1,
                addToCartCount: -1,
                previewCount: -1,
                interests: -1
            })
            .select("name _id description imageUrl")
            .limit(14);

        // return res.status(200).json({
        //     success: true,
        //     message: "products fetched successfully",
        //     products,
        //     popularProducts

        // });
        return res.status(200).render("Pages/Customer/index",{
            success: true,
            message: "products fetched successfully",
            products,
            popularProducts
        });
    } catch (err) {
        console.error(err);
    }
};
let getSearchResults = async (req, res) => {
    try {
        let { userId } = req.session;

        let searchResults = await Search.aggregate([
            // {
            //     $match: { userId: currentUser._id }
            // },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: { productId: "$items.productId" },
                    name: "$items.name",
                    imageUrl: "$items.imageUrl",
                    count: { $count: {} }
                }
            }
        ]);
        // let searchResults = await Search.find({}, {_id: 1});
        return res.json({ length: searchResults.length, searchResults });
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    searchController,
    atlasSearchController,
    postCart,
    deleteCartItem,
    getCart,
    getProducts
};
