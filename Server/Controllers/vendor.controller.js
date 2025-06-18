const mongoose = require("mongoose");

const Product = require("../Models/product.model.js");
const Search = require("../Models/search.model.js");
const User = require("../Models/user.model.js");
const Review = require("../Models/review.model.js");
const Order = require("../Models/order.model.js");

const cloudinary = require("../Utils/cloudinary.js");

const locals = {
    title: "Vendor | CentralMarket ",
    description: "",
    image: "/IMG/favicon.jpg",
    keywords: [],
    categories: Product.schema.path("category").enumValues
};

exports.getDashboard = async (req, res, next) => {
    try {
        let { currentUser } = req.session;
        let vendorId = new mongoose.Types.ObjectId(currentUser._id);
        //next(err)
        let myProducts = await Product.find({ vendorId });
        let myOrders = await Order.aggregate([
            {
                $match: { "items.vendorId": vendorId }
            },
            {
                $unwind: "$items"
            },
            {
                $match: { "items.vendorId": vendorId }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        let completedOrders = myOrders.filter(
            order => order.items.status === "completed"
        );

        let today = Date.now();
        let weekAgo = today - 1000 * 60 * 60 * 24 * 7;

        let allCustomers = await Order.aggregate([
            {
                $match: {
                    "items.vendorId": vendorId
                }
            },
            {
                $group: {
                    _id: "$customerId",
                    orderCount: { $sum: 1 }
                }
            }
        ]);
        // NEW CUSTOMERS IN THE PAST WEEK
        let newCustomers = await Order.aggregate([
            {
                $match: {
                    "items.vendorId": vendorId
                    //, createdAt: {
                    //     $gte: new Date(weekAgo),
                    //     $lte: new Date(today)
                    // }
                }
            },
            {
                $group: {
                    _id: "$customerId",
                    orderCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    orderCount: 1
                }
            }
        ]);
        let revenue = await Order.aggregate([
            {
                $match: {
                    "items.vendorId": vendorId
                }
            },
            {
                $unwind: "$items"
            },
            {
                $match: {
                    "items.vendorId": vendorId
                }
            },
            {
                $group: {
                    _id: null,
                    // totalRevenue: {
                    //     $sum: "$items.subTotal"
                    // },
                    totalRevenue: {
                        $sum: "$items.subTotal"
                    }
                }
            }
        ]);

        let totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;
        return res.status(200).render("Pages/Vendor/dashboard.ejs", {
            myOrders,
            completedOrders,
            allCustomers,
            newCustomers,
            locals,
            myProducts,
            totalRevenue
        });
    } catch (err) {
        next(err);
    }
};
exports.addProduct = async (req, res, next) => {
    try {
        if (!req.body)
            return res.status(401).json({
                success: false,
                message: "nothing is being sent"
            });
        let { currentUser } = req.session;
        if (!currentUser)
            return res.status(403).json({
                success: false,
                message: "user is not logged in"
            });
        console.log(req.file, req.body);
        let imageUrl;
        //  if (req.file) {
        const cloudinary_response = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "products",
                aspect_ratio: "1:1",
                width: 400,
                crop: "limit"
            }
        );

        imageUrl = cloudinary_response.secure_url;
        //  }
        console.log(cloudinary_response, imageUrl);

        let imageGallery = [];
        imageGallery.push(imageUrl);

        let vendorId = currentUser._id;
        let body = JSON.parse(req.body.product);

        let newProduct = new Product({
            ...body,
            imageUrl,
            imageGallery,
            vendorId
        });

        await newProduct.save();
        return res.redirect(`/preview/${newProduct._id}`);
    } catch (err) {
        next(err);
    }
};
exports.deleteProduct = async (req, res, next) => {
    try {
        let { id: productId } = req.params;

        let info = await Product.findByIdAndDelete(productId);

        return res.status(201).json({
            success: true,
            info,
            message: `product with id: ${productId} deleted successfully`
        });
    } catch (err) {
        next(err);
    }
};
exports.getProducts = async (req, res, next) => {
    try {
        let products = await Product.find({})
            .sort({ createdAt: -1 })
            .select("_id name price category imageUrl");

        return res.status(200).json({
            success: true,
            message: "products fetched successfully",
            products
        });
    } catch (err) {
        next(err);
    }
};
exports.editProduct = async (req, res, next) => {
    try {
        if (!req.body)
            return res.status(401).json({
                success: false,
                message: "nothing is being sent"
            });
        let { id: productId } = req.params;

        let imageGallery = [];

        if (req.file) {
            const cloudinary_response = await cloudinary.uploader.upload(
                req.file.path,
                {
                    aspect_ratio: "1:1",
                    width: 400,
                    crop: "limit",
                    folder: "product_galleries"
                }
            );

            imageGallery.push(cloudinary_response.secure_url);

            req.body.imageUrl = cloudinary_response.secure_url;
            req.body.imageGallery = imageGallery;
        }

        let newProduct = {};
        for (prop in req.body) {
            if (req.body[prop]) {
                newProduct[prop] = req.body[prop];
            }
        }

        let updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                $set: {
                    ...newProduct
                }
            },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            updatedProduct,
            message: "product edited successfully"
        });
    } catch (err) {
        next(err);
    }
};

exports.getStore = async (req, res, next) => {
    try {
        let { currentUser } = req.session;
        if (!currentUser.business)
            return res.status(200).render("Pages/Vendor/create_store");
        else return res.redirect("/store/" + currentUser._id );
    } catch (err) {
        next(err);
        console.error(err);
    }
};

exports.postStore = async (req, res, next) => {
    try {
        console.log(req.body);
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "nothing is being sent"
            });
        }

        let { currentUser } = req.session;
        console.log(currentUser);
        if (!currentUser) {
            return res.status(403).json({
                success: false,
                message: "user not logged in"
            });
        }

        let imageUrl;
        if (req.file) {
            const cloudinary_response = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "products",
                    aspect_ratio: "3:1",
                    width: 600,
                    height: 200,
                    crop: "limit"
                }
            );

            imageUrl = cloudinary_response.secure_url;

            console.log(cloudinary_response);
        }

        let { name, description, category } = req.body;
        let { phoneNumber, instagram } = req.body;
        let { address_1, address_2, lga, state } = req.body;
        let { accountName, accountNumber, bankName } = req.body;

        let address = {
            address: address_1 + " " + address_2,
            lga,
            state,
            country: "nigeria"
        };

        let business = {
            name,
            description,
            category,
            coverImage: imageUrl,
            address
        };
        let bankDetails = {
            accountName,
            accountNumber,
            bankName
        };

        instagram = instagram.replace("@", "");

        let updatedUser = await User.findOneAndUpdate(
            { _id: currentUser._id },
            {
                $set: {
                    business,
                    address,
                    bankDetails,
                    role: "vendor",
                    phoneNumber
                },
                $push: {
                    socials: {
                        name: "instagram",
                        url: `https://www.instagram.com/${instagram}`
                    }
                }
            },
            { new: true }
        );

        // if (updatedUser) {
        return res.status(201).json({
            success: true,
            message: "user updated successfully",
            updatedUser
        });
        // return res.redirect("/vendor/");
        // }
    } catch (err) {
        next(err);
        console.error(err);
    }
};
