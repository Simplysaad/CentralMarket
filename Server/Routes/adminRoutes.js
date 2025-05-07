const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: "Uploads/Users",
  filename: function (req, file, cb) {
    let myFileName = Date.now() + "_" + file.originalname;
    cb(null, myFileName);
  }
});

const upload = multer({
  storage: storage
});

const Product = require("../Models/Product.js");
const User = require("../Models/User.js");
const Order = require("../Models/Order.js");
const Search = require("../Models/Search.js");
const Review = require("../Models/Review.js");

const { relatedProductsFunc } = require("../Utils/helper.js");
const { getFrequencies } = require("../Utils/helper.js");

const locals = {
  title: "Admin | CentralMarket",
  description:
    "an incampus shopping website for school online vendors and students, to buy , sell and deliver items without hassle",
  imageUrl: "/IMG/favicon.png"
};

router.get("/orders", async (req, res) => {
  try {
    const allOrders = await Order.find({})
      .populate("customerId")
      .sort({"paymentStatus": -1})
    
    return res.render("Admin/orders", {
      allOrders,
      locals,
      categories: []
    })
    // return res.json({allOrders})
  }
  catch (err) {
    console.error(err)
  }
})
router.get("/orders/:id", async (req, res) => {
  try {
    console.log(req.params.id)
    const currentOrder = await Order.findOne({ _id: req.params.id })
      .populate("items.productId")
      .populate("items.vendorId")

    console.log(currentOrder)

    return res.render("Admin/preview_order", {
      currentOrder,
      locals,
      categories: []
    })
  }
  catch (err) {
    console.error(err)
  }
})

const getRecentSearches = async (req, res) => {
  try {
    const currentUser = await User.findOne({ emailAddress: "saadidris70@gmail.com" })
    console.log("currentUser", currentUser)
    console.log("currentUser._id", currentUser._id)
    const customerRecentSearches = await Search.aggregate([
      //   {
      //         $match: {
      //           "userId": currentUser._id
      //         }
      //       },
      {
        $project: {
          "searchResults": 1,
          "_id": 0
        }
      },
      {
        $unwind: "$searchResults"
      },
      {
        $lookup: {
          from: "products",
          localField: "searchResults.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $group: {
          "_id": {
            $first: {
              $arrayElemAt: ["$product._id", 0]
            }
          },
          "name": {
            $first: {
              $arrayElemAt: ["$product.name", 0]
            }
          },
          "price": {
            $first: {
              $arrayElemAt: ["$product.price", 0]
            }
          },
          "productImage": {
            $first: {
              $arrayElemAt: ["$product.productImage", 0]
            }
          },
          "searchCount": { $sum: 1 }
        }
      },
      {
        $sort: {
          "searchCount": -1
        }
      }
    ])

    return res.json({
      customerRecentSearches
    })
  }
  catch (err) {
    console.error(err)
  }
}

module.exports = router;
