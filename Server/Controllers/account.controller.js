const Product = require("../Models/product.model.js");
const Search = require("../Models/search.model.js");
const User = require("../Models/user.model.js");
const Review = require("../Models/review.model.js");
const Order = require("../Models/order.model.js");

const { shuffle } = require("../Utils/helper.js");
const locals = {
    title: "Account | CentralMarket",
    description: "",
    image: "/IMG/favicon.jpg",
    keywords: []
};

exports.getCart = async (req, res, next) => {
    try {
        let currentUser = await User.findOne({
            _id: req.session.userId
        }).select("-password");

        let { cart = [], wishlist = [] } = req.session;
        let { id: productId } = req.params;

        if (productId) {
            let isExist = cart.find(item => item.productId === productId);

            return res.status(200).json({
                success: !!isExist,
                message: isExist
                    ? "item is in the cart"
                    : "item is not in the cart",
                item: isExist,
                cart
            });
        }

        let cartTotal = cart.reduce((acc, item) => acc + item.subTotal, 0);
        let cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
        let cartItemsCount = cart.length;
        let deliveryFee = 0;

        locals.title = "Cart | CentralMarket";

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
exports.postCart = async (req, res, next) => {
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

exports.getHistory = async (req, res, next) => {
    try {
        let { currentUser } = req.session;

        let allOrders = await Order.find({ customerId: currentUser._id });

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

exports.getWishlist = async (req, res, next) => {
    try {
        let { wishlist } = req.session;
        let { id: productId } = req.params;

        let wishlistProducts = await Product.find({
            _id: { $in: wishlist }
        }).select("name _id price discount imageUrl category amountInStock");

        //JUST CHECKING IF IT EXISTS
        if (productId) {
            let isExist = wishlist.includes(productId);

            console.log({
                success: isExist,
                message: isExist
                    ? "product exists in wishlist"
                    : "product does not exist in wishlist",
                productId,
                wishlistProducts
            });

            return res.status(200).json({
                success: isExist,
                message: isExist
                    ? "product exists in wishlist"
                    : "product does not exist in wishlist",
                productId,
                wishlistProducts
            });
        }
        locals.title = "Wishlist | CentralMarket";
        return res.status(200).render("Pages/Customer/wishlist_page", {
            success: true,
            locals,
            message: "wishlist products fetched successfully",
            wishlistProducts
        });
    } catch (err) {
        next(err);
    }
};
exports.postWishlistItem = async (req, res, next) => {
    try {
        let { id: productId } = req.params;
        console.log(productId);
        //  let { _id: userId } = req.session.currentUser;
        let userId = false;

        req.session.wishlist.push(productId);
        console.log(req.session.wishlist);

        req.session.wishlist = [...new Set(req.session.wishlist)];

        // if (userId) {
        //     let updatedUser = await User.findOneAndUpdate(
        //         { _id: userId },
        //         { $addToSet: { wishlist: { $each: req.session.wishlist } } }
        //     );
        // }

        console.log(req.session.wishlist);

        return res.status(201).json({
            success: true,
            message: "product added to wishlist",
            wishlist: req.session.wishlist
        });
    } catch (err) {
        next(err);
    }
};
exports.deleteWishlistItem = async (req, res, next) => {
    try {
        let { id: productId } = req.params;
        // let { _id: userId } = req.session.currentUser;

        let index = req.session.wishlist.findIndex(id => id === productId);

        if (index >= 0) {
            req.session.wishlist = req.session.wishlist.filter(
                id => id !== productId
            );
        }

        // if (userId) {
        //     let updatedUser = await User.findOneAndUpdate(
        //         { _id: userId },
        //         { $pull: { wishlist: productId } }
        //     );
        // }

        return res.status(201).json({
            success: true,
            message: "product removed from wishlist",
            wishlist: req.session.wishlist
        });
    } catch (err) {
        next(err);
    }
};
