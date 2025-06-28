const Product = require("../Models/product.model.js");
const Search = require("../Models/search.model.js");
const User = require("../Models/user.model.js");
const Review = require("../Models/review.model.js");
const Order = require("../Models/order.model.js");
const Cart = require("../Models/cart.model.js");

const { shuffle } = require("../Utils/helper.js");
const locals = {
    title: "Account | CentralMarket",
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

exports.getCart = async (req, res, next) => {
    try {
        let { currentUserId } = req.session;
        let currentUser = await User.findOne({
            _id: currentUserId
        }).select("-password");

        let cart = await Cart.findOne({
            customerId: currentUserId
        });
        console.log("cart", cart);
        if (!cart) {
            return res.json({
                success: false,
                cart
            });
        }


        let { id: productId } = req.params;

        if (productId) {
            let isExist = cart?.items.find(
                item => item.productId === productId
            );

            return res.status(200).json({
                success: !!isExist,
                message: isExist
                    ? "item is in the cart"
                    : "item is not in the cart",
                item: isExist,
                cart
            });
        }

        const { total, quantity } = cart;

        locals.title = "Cart | CentralMarket";

        return res.status(200).render("Pages/Customer/cart_page", {
            success: true,
            message: "cart items fetched successfully",
            cart,
            locals,
            deliveryFee: 0,
            currentUser
        });
    } catch (err) {
        next(err);
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
                message: `item removed successfully`,
                cart: req.session.cart,
                item: req.session.cart[index]
            });
        } else {
            //if the quantity of the item is more than one, then reduce by one
            req.session.cart[index].quantity -= 1;
            req.session.cart[index].subTotal =
                currentProduct.price * req.session.cart[index].quantity;

            console.log({ cart: req.session.cart });
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
        let { currentUserId } = req.session;

        let allOrders = await Order.find({ customerId: currentUserId });

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

        let { currentUserId } = req.session;

        let wishlist = [];

        if (currentUserId) {
            let currentUser = await User.findOneAndUpdate(
                { _id: currentUserId },
                {
                    $addToSet: {
                        wishlist: productId
                    }
                },
                { new: true }
            );

            wishlist = currentUser.wishlist;
        } else {
            req.session.wishlist = req.session.wishlist ?? [];
            req.session.wishlist.includes(productId)
                ? console.log("item already in wishlist")
                : req.session.wishlist.push(productId);

            wishlist = req.session.wishlist;
        }

        console.log(wishlist);

        return res.status(201).json({
            success: true,
            message: "product added to wishlist",
            wishlist
        });
    } catch (err) {
        next(err);
    }
};
exports.deleteWishlistItem = async (req, res, next) => {
    try {
        const { id: productId } = req.params;
        const { currentUserId } = req.session;
        let wishlist = [];

        if (currentUserId) {
            let updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { wishlist: productId } }
            );
            wishlist = updatedUser.wishlist;
        } else {
            let index = req.session.wishlist.findIndex(id => id === productId);
            if (index >= 0) {
                req.session.wishlist = req.session.wishlist.filter(
                    id => id !== productId
                );
            }
            wishlist = req.session.wishlist;
        }

        return res.status(201).json({
            success: true,
            message: "product removed from wishlist",
            wishlist
        });
    } catch (err) {
        next(err);
    }
};
exports.postCar = async (req, res, next) => {
    try {
        let { id: productId } = req.params;
        let { quantity } = req.query;

        if (!req.session.cart) req.session.cart = [];
        if (quantity && quantity !== "") {
            quantity = Number(quantity);
        }

        //if req.query.quantity exist, change the item quantity to req.query.quantity
        //else increment by 1

        let currentProduct = await Product.findOneAndUpdate(
            { _id: productId },
            {
                $inc: {
                    "meta.addToCartCount": quantity || 1,
                    "meta.interest": 1
                }
            },
            { new: true }
        );

        console.log(currentProduct);

        if (!currentProduct)
            return res.status(404).json({
                success: false,
                message: `product with id: ${productId} does not exist or is not available`
            });

        let cart = [];
        const { currentUserId } = req.session;
        if (currentUserId) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: currentUserId },
                { $addToSet: { cart: singleProduct } }
            );

            cart = updatedUser.cart;
        } else {
            req.session.cart.push(singleProduct);
            let index = req.session.cart.findIndex(
                item => item.productId === productId
            );
            cart = req.session.cart;
        }
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

            const { currentUserId } = req.session;
            let cart = [];
            if (currentUserId) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: currentUserId },
                    { $addToSet: { cart: singleProduct } }
                );

                cart = updatedUser.cart;
            } else {
                req.session.cart.push(singleProduct);
                let index = req.session.cart.findIndex(
                    item => item.productId === productId
                );
                cart = req.session.cart;
            }

            let cartTotal = cart.reduce((acc, item) => acc + item.subTotal, 0);
            let cartQuantity = cart.reduce(
                (acc, item) => acc + item.quantity,
                0
            );
            let cartItemsCount = cart.length;
            let deliveryFee = 0;

            console.log("cart", cart);
            return res.status(201).json({
                success: true,
                cartTotal,
                cartQuantity,
                deliveryFee,
                message: "new product added to cart",
                cart,
                item: cart[index]
            });
        } else {
            if (quantity) {
                req.session.cart[index].quantity = quantity;
                req.session.cart[index].subTotal =
                    currentProduct.price * quantity;
            } else {
                req.session.cart[index].quantity += 1;
                req.session.cart[index].subTotal =
                    currentProduct.price * req.session.cart[index].quantity;
            }
            console.log({ cart: req.session.cart });

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
                message: "existing product incremented successfully",
                cart: req.session.cart,
                item: req.session.cart[index]
            });
        }
    } catch (err) {
        next(err);
    }
};

exports.postCart = async (req, res, next) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.query;
        const { currentUserId } = req.session;

        const currentProduct = await Product.findOneAndUpdate(
            { _id: productId },
            {
                $inc: {
                    "meta.addToCartCount": quantity || 1,
                    "meta.interest": 1
                }
            },
            { new: true }
        ).select("vendorId, _id, name, price");

        if (!currentProduct)
            return res.status(404).json({
                success: false,
                message: `product with id: ${productId} does not exist or is not available`
            });

        const { price: unitPrice } = currentProduct;
        let singleProduct = {
            ...currentProduct,
            productId,
            unitPrice,
            subTotal: unitPrice * quantity,
            quantity
        };

        if (currentUserId) {
            let currentUser = await User.findOne(
                { _id: currentUserId },
                { cart: 1 }
            );

            let { cart } = currentUser;
            let index = cart.findIndex(item => item.productId === productId);
            let updatedUser;
            if (index === -1) {
                updatedUser = await User.findOneAndUpdate(
                    { _id: currentUserId },
                    {
                        $push: { cart: singleProduct }
                    },
                    {
                        new: true
                    }
                );
            } else {
                updatedUser = await User.findOneAndUpdate(
                    { _id: currentUserId, "cart._id": cart[index]._id },
                    {
                        $inc: { "cart.$.quantity": 1 }
                    },
                    {
                        new: true
                    }
                );
            }
        }
    } catch (err) {
        next(err);
    }
};
