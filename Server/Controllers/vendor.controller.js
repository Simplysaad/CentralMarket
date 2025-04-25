const mongoose = require("mongoose");

const Product = require("../Models/product.model.js");
const Search = require("../Models/search.model.js");
const User = require("../Models/user.model.js");
const Review = require("../Models/review.model.js");
const Order = require("../Models/order.model.js");


const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.addProduct = async (req, res) => {
    try {
        if (!req.body)
            return res.status(401).json({
                success: false,
                message: "nothing is being sent"
            });
        // if (!req.files) {
        let imageUrl;

        console.log(req.file);
        if (req.file) {
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
        } else imageUrl = "https://placehold.co/400x400";

        let imageGallery = [];
        imageGallery.push(imageUrl);

        let vendorId = req.session.userId;

        let newProduct = new Product({
            ...req.body,
            imageUrl,
            imageGallery,
            vendorId
        });

        let savedProduct = await newProduct.save();
        return res.status(201).json({
            success: true,
            newProduct,
            savedProduct,
            message: "new product created successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "internal server error",
            advice: "something's wrong here, try again later",
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        let { id: productId } = req.params;

        let info = await Product.findByIdAndDelete(productId);

        return res.status(201).json({
            success: true,
            info,
            message: `product with id: ${productId} deleted successfully`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "internal server error: deleteProduct",
            advice: "something's wrong here, try again later",
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};
exports.getProducts = async (req, res) => {
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
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "internal server error",
            advice: "something's wrong here, try again later",
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};
exports.editProduct = async (req, res) => {
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
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "internal server error",
            advice: "something's wrong here, try again later",
            errorMessage: err.message,
            errorStack: err.stack
        });
    }
};

exports.dashboard = async (req, res) => {
    try {
        let { userId } = req.session;
        let currentVendor = await User.findOne({ _id: userId });

        let pipeline = [
            {
                $unwind: "$items"
            },
            {
                $match: {
                    "items.vendorId": new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $sort: {
                    status: -1
                }
            },
            {
                $project: {
                    name: "$items.name",
                    productId: "$items.productId",
                    quantity: "$items.quantity",
                    size: "$items.size",
                    color: "$items.color",
                    price: "$items.price",
                    orderId: "$_id"
                }
            }
        ];

        let myOrders = await Order.aggregate(pipeline);
        return res.status(200).json({
            success: true,
            message: "orders processed",
            myOrders
        });
    } catch (err) {
        console.error(err);
    }
};
