const mongoose = require("mongoose");

const Product = require("../Models/product.model.js");
const Search = require("../Models/search.model.js");
const User = require("../Models/user.model.js");
const Review = require("../Models/review.model.js");
const Order = require("../Models/order.model.js");

const locals = {
  title: "Vendor | CentralMarket ",
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


const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
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
      newCustomers, locals,
      myProducts,
      totalRevenue
    });
  } catch (err) {
    next(err);
  }
}
exports.addProduct = async (req, res, next) => {
  try {
    if (!req.body)
      return res.status(401).json({
        success: false,
        message: "nothing is being sent"
      });
    // if (!req.files) {
    let imageUrl;
    let { productId } = req.query

    console.log(req.file);
    if (req.file && productId) {
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
      if (imageUrl) {
        let updatedProduct = await Product.findOneAndUpdate({ _id: productId }, {
          $set: {
            imageUrl
          }
        }, { new: true })

        return res.status(201).json({
          success: true,
          message: "image added successfully",
          updatedProduct
        })
      }

    } else imageUrl = `https://placehold.co/400x400/text=${req.body.name}`;

    let imageGallery = [];
    imageGallery.push(imageUrl);

    let vendorId = req.session.currentUser._id;
    console.log(
      req.body,
      // imageUrl,
      // imageGallery,
      // vendorId
    );

    let newProduct = new
      Product({
        ...req.body,
        imageUrl,
        imageGallery,
        vendorId
      });

    let savedProduct = await newProduct.save();
    // return res.status(201).json({
    //     success: true,
    //     newProduct,
    //     savedProduct,
    //     message: "new product created successfully"
    // });
    return res.redirect(`/preview/${savedProduct._id}`)


  } catch (err) {
    next(err);
    // return res.status(500).json({
    //     success: false,
    //     message: "internal server error",
    //     advice: "something's wrong here, try again later",
    //     errorMessage: err.message,
    //     errorStack: err.stack
    // });
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
    // return res.status(500).json({
    //     success: false,
    //     message: "internal server error: deleteProduct",
    //     advice: "something's wrong here, try again later",
    //     errorMessage: err.message,
    //     errorStack: err.stack
    // });
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
    // return res.status(500).json({
    //     success: false,
    //     message: "internal server error",
    //     advice: "something's wrong here, try again later",
    //     errorMessage: err.message,
    //     errorStack: err.stack
    // });
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
