let Product = require("../Models/product.model.js");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const addProduct = async (req, res) => {
    try {
        if (!req.body)
            return res.status(401).json({
                success: false,
                message: "nothing is being sent"
            });
        // if (!req.files) {
        let imageUrl;
        if (!req.file) {
            // return res.status(401).json({
            //     success: false,
            //     message: "no file is being sent"
            // });
            // console.log(req.body);
        }

        console.log(req.file);
        if (req.file) {
            const cloudinary_response = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "products"
                }
            );
            imageUrl = cloudinary_response.secure_url;
        } else imageUrl = "https://placehold.co/400";

        let imageGallery = [];
        imageGallery.push(imageUrl);

        let newProduct = new Product({
            ...req.body,
            imageUrl,
            imageGallery
        });

        let savedProduct = await newProduct.save();
        return res.status(201).json({
            success: true,
            newProduct,
            savedProduct,
            message: "new product created successfully",
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
const editProduct = async (req, res) => {
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
                req.file.path
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

module.exports = {
    addProduct,
    deleteProduct,
    editProduct,
    getProducts
};
