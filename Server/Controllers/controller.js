const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Import necessary models
const Product = require("../Models/Product.js");
const User = require("../Models/User.js");
const Order = require("../Models/Order.js");
const Search = require("../Models/Search.js");
const Review = require("../Models/Review.js");

// Import helper function
const { relatedProductsFunc } = require("../Utils/helper.js");


const getPopularProducts = async (req, res) => {
  try {
    const popularProducts = await Search.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "searchResults.productId",
          foreignField: "_id",
          as: "items"
        }
      },
      {
        $project: {
          "items": 1
        }
      },
      {
        $unwind: "$items"
      },
      {
        $group: {
          "_id": "$items._id",
          "name": { $first: "$items.name" },
          "price": { $first: "$items.price" },
          "productImage": { $first: "$items.productImage" },
          "vendor": { $first: "$items.vendorId" },
          "searchCount": { "$count": {} }
        }
      },
      {
        $sort: {
          "searchCount": -1
        }
      },
      {
        $limit: 12
      }
    ])

    return popularProducts
  }
  catch (err) {
    throw new Error(err)
  }
}

const getRecentSearches = async (req, res) => {
  try {
    const currentUser = await User.findOne({ emailAddress: "saadidris70@gmail.com" })
    console.log("currentUser", currentUser)
    console.log("currentUser._id", currentUser._id)
    const customerRecentSearches = await Search.aggregate([
      {
        $match: {
          "userId": currentUser._id
        }
      },
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
          // "_id": {
          //   $first: {
          //     $arrayElemAt: ["$product._id", 0]
          //   }
          // },
          // "name": {
          //   $first: {
          //     $arrayElemAt: ["$product.name", 0]
          //   }
          // },
          // "price": {
          //   $first: {
          //     $arrayElemAt: ["$product.price", 0]
          //   }
          // },
          // "productImage": {
          //   $first: {
          //     $arrayElemAt: ["$product.productImage", 0]
          //   }
          // },
          // "searchCount": { $sum: 1 }
          
          "_id": "$product._id" ,
          "name": { $first: "$product.name" },
          "price": { $first: "$product.price" },
          "productImage": { $first: "$product.productImage" },
          "searchCount": { $sum: 1 }
        }
      },
      {
        $sort: {
          "searchCount": -1
        }
      },
      {
        $limit: 12
      }
    ])

    return customerRecentSearches

  }
  catch (err) {
    console.error(err)
  }
}


module.exports = {
  getPopularProducts,
  getRecentSearches
}