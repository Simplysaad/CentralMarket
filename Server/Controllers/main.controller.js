const Product = require("../Models/product.model.js");
const Search = require("../Models/search.model.js");
const User = require("../Models/user.model.js");
const Review = require("../Models/review.model.js");
const Order = require("../Models/order.model.js");

const { shuffle } = require("../Utils/helper.js");
const locals = {
    title: "CentralMarket",
    description: "",
    image: "/IMG/favicon.jpg",
    keywords: []
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

        locals.title = "Home | CentralMarket"
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
            ],


        })
        searchResults.services = []
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
            locals.title = `Search for ${searchTerm} - no results | CentralMarket`
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

        locals.title = `Search for ${searchTerm}| CentralMarket`
        return res.status(201).render("Pages/Customer/search_page", {
            success: true,
            searchResults,
            searchTerm,
            locals,
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

exports.postCart = async (req, res, next) => {
    try {
        console.log("i'm to post cart")

        if (!req.session.cart) req.session.cart = [];

        let { userId, cart } = req.session;
        let { id: productId } = req.params;

        let { quantity, wish } = req.query;

        if (quantity && quantity !== "") {
            quantity = Number(quantity);
        }

        //if req.query.quantity exist, change the item quantity to req.query.quantity
        //else increment by 1

        let currentProduct = await Product.findOneAndUpdate(
            { $and: [{ _id: productId }, { available: true }] },
            {
                $inc: {
                    addToCartCount: quantity || 1,
                    interest: 1
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
                vendorId: currentProduct.vendorId,
                name: currentProduct.name,
                subTotal: currentProduct.price * quantity,
                unitPrice: currentProduct.price,
                quantity,
                // color, size,
                productId
            };
            req.session.cart.push(singleProduct);
            let index = req.session.cart.findIndex(
                item => item.productId === productId
            );

            let cartTotal = cart.reduce((acc, item) => acc + item.subTotal, 0);
            let cartQuantity = cart.reduce(
                (acc, item) => acc + item.quantity,
                0
            );
            let cartItemsCount = cart.length;
            let deliveryFee = 0;

            // console.log({ cart: req.session.cart });
            return res.status(201).json({
                success: true,
                cartTotal,
                cartQuantity,
                deliveryFee,
                message: "new product added to cart",
                cart: req.session.cart,
                item: req.session.cart[index]
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
            console.log({ cart: req.session.cart });

            let cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
            let cartQuantity = cart.reduce(
                (acc, item) => acc + item.quantity,
                0
            );
            let cartItemsCount = cart.length;
            let deliveryFee = 0;

            // console.log({ cart: req.session.cart });
            return res.status(201).json({
                success: true,
                cartTotal,
                cartQuantity,
                deliveryFee,
                message: "existing product incremented successfully",
                cart: req.session.cart,
                item: req.session.cart[index]
            });
        }
    } catch (err) {
        next(err);
        return res.status(422).json({
            success: false,
            message: "error encountered while adding product to cart "
            // ,cart: req.session.cart
        });
    }
};
exports.deleteCartItem = async (req, res, next) => {
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
        //If product is not in the cart
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
            let cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
            let cartQuantity = cart.reduce(
                (acc, item) => acc + item.quantity,
                0
            );
            let cartItemsCount = cart.length;
            let deliveryFee = 0;

            // console.log({ cart: req.session.cart });
            return res.status(201).json({
                success: true,
                cartTotal,
                cartQuantity,
                deliveryFee,
                message: `item removed successfully`,
                cart: req.session.cart,
                item: req.session.cart[index]
            });
        } else {
            //if the quantity of the item is more than one, then reduce by one
            req.session.cart[index].quantity -= 1;
            req.session.cart[index].price =
                currentProduct.price * req.session.cart[index].quantity;

            console.log({ cart: req.session.cart });
            let cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
            let cartQuantity = cart.reduce(
                (acc, item) => acc + item.quantity,
                0
            );
            let cartItemsCount = cart.length;
            let deliveryFee = 0;

            // console.log({ cart: req.session.cart });
            return res.status(201).json({
                success: true,
                cartTotal,
                cartQuantity,
                deliveryFee,
                message: `item quantity decremented successfully by ${quantity}`,
                cart: req.session.cart,
                item: req.session.cart[index]
            });
        }
    } catch (err) {
        next(err);
        return res.status(500).json({
            success: false,
            message: `internal server error: error encountered while adding item to cart`,
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};

exports.getCart = async (req, res, next) => {
    try {
        let currentUser = await User.findOne({
            _id: req.session.userId
        }).select("-password");

        let { cart = [], wishlist = [] } = req.session;
        let { checkCart, checkWishList, productId } = req.query;

        if (checkCart === "true") {
            let { cart = [] } = req.session;
            console.log(cart);
            return res.status(200).json({
                success: true,
                message: "here's the cart",
                cart
            });
        }
        if (checkWishList === "true") {
            let { wishlist = [] } = req.session;

            console.log(wishlist);
            return res.status(200).json({
                success: true,
                message: "here's the wishlist",
                wishlist
            });
        }

        let cartTotal = cart.reduce((acc, item) => acc + item.subTotal, 0);
        let cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
        let cartItemsCount = cart.length;
        let deliveryFee = 0;
        locals.title = "Cart | CentralMarket"
        return res.status(200).render("Pages/Customer/cart_page", {
            success: true,
            message: "cart items fetched successfully",
            cart,
            locals,
            deliveryFee,
            cartTotal,
            cartQuantity,
            currentUser,
            cartItemsCount
        });
    } catch (err) {
        next(err);
        return res.status(500).json({
            success: false,
            message: `internal server error: error encountered while fetching cart items`,
            errorMessage: err.message,
            errorStack: err.stack
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
        locals.title = "Products | CentralMarket"
        return res.status(200).render("Pages/Customer/index_page", {
            success: true,
            message: "products fetched successfully",
            products,
            cart, locals,
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
        console.log("items", items);
        console.log("req.session", req.session);
        //let { customerId, items } = req.body;

        // if (!customerId)
        //     return res.status(403).json({
        //         success: false,
        //         message: "user not logged in"
        //     });

        items.forEach(async item => {
            let itemId = item.productId;

            let updatedItem = await Product.findOneAndUpdate(
                { _id: itemId },
                {
                    $inc: {
                        purchaseCount: item.quantity
                    }
                },
                { new: true }
            );
        });

        let newOrder = new Order({
            customerId,
            items
        });

        await newOrder.save().then(() => {
            req.session.cart = [];
            console.log("cart cleared");
        });

        return res.status(200).json({
            success: true,
            message: "order placed successfully",
            newOrder
        });
    } catch (err) {
        next(err);
        return res.status(500).json({
            success: false,
            message: "error encountered while placing order"
        });
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

        let currentProduct = await Product.findOne({ _id: productId });
        let reviews = await Review.find({ 
            productId,
            message: {$ne: null},
            customerId: {$ne: null},

        }).populate("customerId");
        
        locals.title = `${currentProduct.name.toUpperCase()} | CentralMarket`
        return res.render("Pages/Customer/preview_page", {
            currentProduct,
            reviews, locals
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
        locals.title = `${categoryName} | CentralMarket`
        return res.status(200).render("Pages/Customer/category_page.ejs", {
            categoryName,
            subCategories: subCategoriesElements,
            featuredProducts, locals,
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
                currentUser, locals,
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
            isCurrentVendor, locals
        });
    } catch (err) {
        console.error(err);
    }
};
