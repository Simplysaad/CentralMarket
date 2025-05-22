const Product = require("../Models/product.model.js");
const Search = require("../Models/search.model.js");
const User = require("../Models/user.model.js");
const Review = require("../Models/review.model.js");
const Order = require("../Models/order.model.js");

const ContentBasedRecommender = require('content-based-recommender')
const recommender = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocuments: 100
});

const { default: fetch } = require("node-fetch");

const { shuffle } = require("../Utils/helper.js");
const locals = {
    title: "CentralMarket",
    description: "",
    image: "/IMG/favicon.jpg",
    keywords: [],
    categories: [
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
    ]
};

exports.getHomeProducts = async (req, res, next) => {
    try {
        // GET NEW ARRIVALS
        let newArrivals = shuffle(
            await Product.find({}).sort({ createdAt: -1 }).limit(14)
        );
        //newArrivals = shuffle(newArrivals);
        let { categories } = req.app.locals;
        let allProducts = shuffle(await Product.find({}));

        //DEALS OF THE DAY
        let discountedProducts = shuffle(
            await Product.find({
                "discount.value": { $gt: 0 }
            })
        );
        //deals = shuffle(discountedProducts, 14);

        //FEATURED BRANDS
        let featuredProducts = shuffle(
            await Product.find({ isFeatured: true })
                .sort({ updatedAt: -1 })
                .limit(16)
        );
        //   featuredProducts = shuffle(featuredProducts);

        //TOP RATED PRODUCTS
        let topRatedProducts = shuffle(
            await Product.find({}).sort({ averageRating: -1 }).limit(16)
        );

        let { cart = [] } = req.session;

        locals.title = "Home | CentralMarket";
        return res.status(200).render("Pages/Customer/index_page", {
            locals,
            topRatedProducts,
            featuredProducts,
            discountedProducts,
            newArrivals,
            allProducts,
            categories
        });
    } catch (err) {
        next(err);
    }
};

exports.searchController = async (req, res, next) => {
    try {
        const dirtyRegex = /[</\\>&;//]/gi;

        // Extract search term from query or body (handle both GET and POST)
        // Sanitize and trim search term to prevent injection
        let searchTerm = (req.body.searchTerm || req.query.searchTerm)
            ?.toLowerCase()
            .replace(dirtyRegex, " ")
            .trim();

        if (!searchTerm || searchTerm === "") {
            return res.status(400).json({
                success: false,
                searchTerm,
                message: "empty search term"
            });
        }

        //Get userId from session
        let { userId, currentUser } = req.session;

        // Create regex for case-insensitive search
        let regex = new RegExp(searchTerm, "gi");

        // Search for products based on various fields using the regex
        let searchResults = {};

        // searchResults.products = await Product.aggregate([
        //     {
        //         $search: {
        //             index: "products_index",
        //             text: {
        //                 query: searchTerm,
        //                 path: [
        //                     "name",
        //                     "category",
        //                     "subCategory",
        //                     "description",
        //                     "keywords"
        //                 ]
        //             }
        //         }
        //     },
        //     {
        //         $match: {
        //             category: { $ne: "services" }
        //         }
        //     }
        // ]);
        searchResults.products = await Product.find({
            $or: [
                { name: regex },
                { category: regex },
                { subCategory: regex },
                { description: regex },
                { keywords: regex }
            ]
        });
        searchResults.services = [];
        // searchResults.services = await Product.aggregate([
        //     {
        //         $search: {
        //             index: "products_index",
        //             text: {
        //                 query: searchTerm,
        //                 path: [
        //                     "name",
        //                     "category",
        //                     "subCategory",
        //                     "description",
        //                     "keywords"
        //                 ]
        //             }
        //         }
        //     },
        //     {
        //         $match: { category: "services" }
        //     }
        // ]);
        // Ive not created the users index yet

        searchResults.vendors = await User.find({
            $or: [
                { "business.name": regex },
                { name: regex }, //just for testing purposes
                { description: regex },
                { tags: regex }
            ]
        })
            .limit(20)
            .select("-password ")
            .select("_id business description coverImage profileImage category")
            .lean();

        searchResults.products = await Product.find({
            $or: [
                { name: regex },
                { description: regex },
                { category: regex },
                { subCategory: regex },
                { keywords: regex }
            ]
        })
            .limit(20)
            .lean();

        // Handle empty search results
        if (
            searchResults.products?.length === 0 &&
            searchResults.services?.length === 0 &&
            searchResults.vendors?.length === 0
        ) {
            console.log(searchTerm, "brought no results ");

            let recommendations = await Product.aggregate([
                {
                    $sample: { size: 21 }
                }
            ]);

            locals.title = `Search for ${searchTerm} - no results | CentralMarket`;
            return res.status(201).render("Pages/Customer/empty_search_page", {
                success: false,
                locals,
                searchResults,
                searchTerm,
                recommendations,
                message: "empty search",
                advice: "seems we can't find what you seek! please try again later"
            });
        }

        // Create and save new search record
        const newSearch = new Search({
            userId: currentUser?._id || userId, // Store userId, if available
            searchTerm,
            searchResults
        });

        await newSearch.save().then(() => {
            console.log("Search data saved");
        });

        //locals.title = "search for " + searchTerm + " | CentralMarket"; // Update title

        // return search results page
        // return res.status(200).json({
        //     success: true,
        //     searchResults,
        //     searchTerm
        // });

        locals.title = `Search for ${searchTerm}| CentralMarket`;
        return res.status(201).render("Pages/Customer/search_page", {
            success: true,
            searchResults,
            searchTerm,
            locals
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

exports.getProducts = async (req, res, next) => {
    try {
        let products = await Product.find({ available: true });

        let cart = req.session.cart ?? [];

        let newArrivals = await Product.find({ available: true })
            .sort({
                amountSold: -1,
                addToCartCount: -1,
                previewCount: -1,
                interests: -1
            })
            .limit(14);

        locals.title = "Products | CentralMarket";
        return res.status(200).render("Pages/Customer/index_page", {
            success: true,
            message: "products fetched successfully",
            products,
            cart,
            locals,
            newArrivals
        });
    } catch (err) {
        next(err);
        return res.status(200).json({
            success: false,
            message: "error encountered while fetching products",
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};
exports.getSearchResults = async (req, res, next) => {
    try {
        let { userId, currentUser } = req.session;

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
        next(err);
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        let { userId: customerId, cart: items } = req.session;

        items?.forEach(async item => {
            let itemId = item.productId;

            let updatedItem = await Product.findOneAndUpdate(
                { _id: itemId },
                {
                    $inc: {
                        purchaseCount: item.quantity,
                        amountInStock: -1
                    }
                },
                { new: true }
            );
        });
        let totalCost = items.reduce((acc, item) => acc + item.subTotal, 0);

        // paystack api
        let currentUser = await User.findOne({ _id: req.session.userId });

        // initialize  transaction
        let paystack_response = await fetch(
            "https://api.paystack.co/transaction/initialize",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_TEST}`
                },
                method: "POST",
                body: JSON.stringify({
                    email: currentUser?.emailAddress || "saadidris70@gmail.com",
                    first_name: currentUser?.name.split(" ")[0],
                    last_name: currentUser?.name.split(" ")[1],
                    amount: `${totalCost * 100}`
                })
            }
        );

        let { data, status } = await paystack_response.json().then(data => {
            req.session.reference = data.data.reference;
            return data;
        });

        // send authorization url
        // validate transaction

        // console.log(newOrder)
        console.log({
            success: true,
            message: "order placed successfully",
            data
        });
        return res.json({
            success: true,
            message: "order placed successfully",
            data
        });
    } catch (err) {
        next(err);
    }
};
exports.getValidateOrder = async (req, res, next) => {
    try {
        let { userId: customerId, cart: items } = req.session;
        let totalCost = items?.reduce((acc, item) => acc + item.subTotal, 0);

        // validate transaction
        let paystack_response = await fetch(
            `https://api.paystack.co/transaction/verify/${
                req.session.reference || req.query?.reference
            }`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_TEST}`
                },
                method: "GET"
            }
        );

        if (!paystack_response.ok)
            throw new Error("network response was not ok");

        let { data, status } = await paystack_response.json();
        console.log(data, status);

        let newOrder = new Order({
            customerId,
            items,
            totalCost,
            payment: data
        });

        await newOrder.save().then(() => {
            req.session.cart = [];
            console.log("cart cleared");
        });

        console.log({
            success: true,
            message: "order placed successfully",
            newOrder
        });
        return res.redirect("/cart"); // Should redirect to a page that helps track the order
    } catch (err) {
        next(err);
    }
};
exports.getOrder = async (req, res, next) => {
    try {
        let allOrders = await Order.find();
        return res.status(200).json({
            success: true,
            message: "orders retrieved successfully",
            allOrders
        });
    } catch (err) {
        next(err);
        return res.status(500).json({
            success: false,
            message: "error encountered while placing order"
        });
    }
};
exports.postOrderMassive = async (req, res, next) => {
    try {
        let allProducts = await Product.find({}).select("_id name price");
        let { massive = 5 } = req.query;

        let BASE_URL = "http://localhost:8000";

        // for (let i = 0; i < massive; i++) {
        let randomQuantity = Math.floor(Math.random() * 10);
        let randomCartLength = Math.floor(Math.random() * 10);
        let randomIndex = Math.floor(Math.random() * allProducts.length);

        let randomItem = allProducts[randomIndex];

        //     console.log(
        //         "randomQuantity",
        //         randomQuantity,
        //         "randomCartLength",
        //         randomCartLength,
        //         "randomItem",
        //         randomItem
        //     );
        //     setTimeout(async function () {
        //         let orderResponse = await fetch(`${BASE_URL}/order`, {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json"
        //             }
        //         });
        //     }, 3000);
        // }
        for (let i = 0; i < randomCartLength; i++) {
            fetch(
                // `${BASE_URL}/cart/${randomItem._id}?quantity=${randomQuantity}`,
                `/cart/${randomItem._id}?quantity=${randomQuantity}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                }
            )
                .then(response => response.json())
                .then(data => console.log("cart data", data));

            //console.log("orderResponse", orderResponse);
        }
        return res.status(200).json({
            success: true,
            message: "massive orders made successfully"
        });
    } catch (err) {
        next(err);
        return res.status(500).json({
            success: false,
            message: "error encountered while placing massive orders",
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};

exports.getPreview = async (req, res, next) => {
    try {
        let { id: productId } = req.params;
        console.log(req.params);
        if (!productId) {
            let [currentProduct] = await Product.aggregate([
                { $sample: { size: 1 } }
            ]);
            return res.status(303).redirect(`/preview/${currentProduct._id}`);
        }

        let currentProduct = await Product.findOneAndUpdate(
            { _id: productId },
            {
                $inc: { "meta.previewCount": 1 }
            },
            { new: true }
        );

        //USE random products for recommendation
        //i will use a different package later
        let recommendations = await Product.aggregate([
            { $sample: { size: 8 } }
        ]);
        
        
        let reviews = await Review.find({
            productId,
            message: { $ne: null },
            customerId: { $ne: null }
        }).populate("customerId");

        locals.title = `${currentProduct.name} | CentralMarket`;
        return res.render("Pages/Customer/preview_page", {
            currentProduct,
            reviews,
            locals,
            recommendations
        });
    } catch (err) {
        next(err);
    }
};
exports.getPreviewRandom = async (req, res, next) => {
    try {
        let [currentProduct] = await Product.aggregate([
            { $sample: { size: 1 } }
        ]);
        return res.status(303).redirect(`/preview/${currentProduct._id}`);
    } catch (err) {
        next(err);
    }
};

exports.getCategoryProducts = async (req, res, next) => {
    try {
        const { categoryName } = req.params;
        const categoryProducts = await Product.find({
            category: categoryName
        });

        const featuredProducts = categoryProducts.filter(
            product => product.isFeatured
        );

        const discountedProducts = categoryProducts.filter(
            product => product.discount?.value > 0
        );

        const subCategories = [
            ...new Set(categoryProducts.map(product => product.subCategory))
        ];
        console.log(subCategories);

        let subCategoriesElements = [];
        subCategories.forEach((subCategory, index) => {
            let subCategoryGroup = {
                name: subCategory,
                products: categoryProducts.filter(
                    product => product.subCategory === subCategory
                )
            };
            // if (subCategoryGroup.products.length >= 10)
            subCategoriesElements.push(subCategoryGroup);
        });

        // return res.status(200).json({
        locals.title = `${categoryName} | CentralMarket`;
        return res.status(200).render("Pages/Customer/category_page.ejs", {
            categoryName,
            subCategories: subCategoriesElements,
            featuredProducts,
            locals,
            discountedProducts
        });
    } catch (err) {
        next(err);
    }
};
exports.getReviewPage = async (req, res, next) => {
    try {
        let { id: productId } = req.params;
        let currentProduct = await Product.findOne({ _id: productId }).select(
            "_id name"
        );
        let { currentUser = { name: "guest" } } = req.session;
        if (productId)
            return res.status(200).render("Pages/Customer/review_page", {
                currentProduct,
                currentUser,
                locals
            });
    } catch (err) {
        next(err);
    }
};

exports.postReview = async (req, res, next) => {
    try {
        let { helpful, reviewId, rating, message } = req.body;
        let { id: productId } = req.params;
        let { currentUser } = req.session;

        if (helpful === "true" && reviewId) {
            let currentReview = await Review.findOneAndUpdate(
                { _id: reviewId },
                {
                    $inc: {
                        helpfulVotes: 1
                    }
                }
            );
            return res.status(200).json({ currentReview });
        }
        // if (message && rating) {
        let newReview = new Review({
            message,
            rating,
            productId,
            customerId: currentUser?._id
        });

        let currentProduct = await Product.findOneAndUpdate(
            {
                _id: productId
            },
            {
                $push: {
                    ratings: rating
                }
            },
            {
                new: true
            }
        );
        await newReview.save();
        return res.status(304).redirect(`/preview/${productId}#reviewsSection`);
        // }
    } catch (err) {
        next(err);
    }
};

exports.getStore = async (req, res) => {
    try {
        let { id: vendorId } = req.params;
        let { currentUser } = req.session;

        let currentVendor = await User.findOne({ _id: vendorId }); //.select("name business")
        let currentVendorProducts = await Product.find({ vendorId }); //.select("name business")
        let isCurrentVendor = currentVendor?._id === currentUser?._id;

        console.log({
            currentVendor,
            products: currentVendorProducts,
            isCurrentVendor
        });

        return res.status(200).render("Pages/Customer/store_page", {
            currentVendor,
            products: currentVendorProducts,
            isCurrentVendor,
            locals
        });
    } catch (err) {
        console.error(err);
    }
};
