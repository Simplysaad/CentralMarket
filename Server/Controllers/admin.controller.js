let Product = require("../Models/product.model.js");
let cloudinary = require("cloudinary");

const addProduct = async (req, res) => {
    try {
        if (!req.body)
            return res.status(401).json({
                success: false,
                message: "nothing is being sent"
            });
        // if (!req.files) {
        if (!req.file) {
            // console.log(req.body);
            return res.status(401).json({
                success: false,
                message: "no file is being sent"
            });
        }

        console.log(req.file);
        const cloudinary_response = await cloudinary.uploader.upload(
            req.file.path
        );

        //console.log(cloudinary_response);
        let imageGallery = [];
        imageGallery.push(cloudinary_response.secure_url);

        let newProduct = new Product({
            ...req.body,
            imageUrl: cloudinary_response.secure_url,
            imageGallery
        });

        let savedProduct = await newProduct.save();
        return res.status(201).json({
            success: true,
            newProduct,
            savedProduct,
            message: "new product created successfully",
            cloudinary_response
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
const deleteProduct = async (req, res) => {
    try {
        let { productId } = req.params;

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
const getProducts = async (req, res) => {
    try {
        let products = await Product.find({})
            .sort({ createdAt: -1 })
            .select("_id name price category imageUrl");

        return res.status(200).json({
            success: true,
            message: "products fetched successfully",
            products
        });
    } catch (e) {}
};
const editProduct = async (req, res) => {
    try {
        if (!req.body)
            return res.status(401).json({
                success: false,
                message: "nothing is being sent"
            });
        let { productId } = req.params;

        let imageGallery = [];

        let newProduct = {
            ...req.body
        };

        if (req.file) {
            const cloudinary_response = await cloudinary.uploader.upload(
                req.file.path
            );

            imageGallery.push(cloudinary_response.secure_url);

            newProduct.imageUrl = cloudinary_response.secure_url;
            newProduct.imageGallery = imageGallery;
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

module.exports = {
    addProduct,
    deleteProduct,
    editProduct, getProducts
};
