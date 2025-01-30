const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");

const storage = multer.diskStorage({
  destination: "PUBLIC/Uploads/Users",
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
  title: "Campus Mart",
  description:
    "an incampus shopping website for school online vendors and students, to buy , sell and deliver items without hassle",
  imageUrl: "/IMG/favicon.png"
};

router.get("/", async (req, res) => {
  res.json({ message: "this is the homepage" });
});
router.post("/", upload.array("productImage"), async (req, res) => {
  try {
    res.json(req.files);
  } catch (err) {
    console.error(err);
  }
});
router.post("/api/deleteAllUsers", async (req, res) => {
  try {
    User.deleteMany({}).then(data => {
      console.log("all users deleted successfully");
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/api/updateAllProducts", async (req, res) => {
  try {
    const arrayOfProducts = require("./arrayOfProducts");
    console.log(arrayOfProducts);

    Product.insertMany(arrayOfProducts).then(data => {
      console.log("new products inserted successfully");
      res.send("new updated products inserted successfully");
    });
  } catch (err) {
    console.error(err);
  }
});
router.post("/api/updateProductsImage", async (req, res) => {
  try {
    const newImage = "https://via.placeholder.com/300x300";

    Product.updateMany(
      {},
      {
        $set: {
          productImage: newImage
        }
      }
    ).then(data => {
      console.log(" products images updated successfully");
      res.send(" products images updated successfully");
    });
  } catch (err) {
    console.error(err);
  }
});
router.post("/api/updateProductsCategory", async (req, res) => {
  try {
    await Product.updateMany(
      {
        $or: [{ category: "Books" }, { category: "Stationery" }]
      },
      {
        $set: {
          category: "Books & Stationery"
        }
      }
    );
    await Product.updateMany(
      { category: "Clothing" },
      {
        $set: {
          category: "Clothing & Accessories"
        }
      }
    );
    await Product.updateMany(
      { category: "Home & Living" },
      {
        $set: {
          category: "Home & Kitchen"
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

router.get("/api/getAllProducts", async (req, res) => {
  try {
    const products = await Product.find({}, { _id: 0 }).sort({
      category: -1,
      name: 1
    });
    res.json({ products });
  } catch (err) {
    console.error(err);
  }
});
router.get("/api/getFeaturedProducts", async (req, res) => {
  try {
    const FeaturedProducts = await Product.find({ isFeatured: true }).sort({
      updatedAt: -1
    });
    res.json({ FeaturedProducts });
  } catch (err) {
    console.error(err);
  }
});

router.get("/api/getCategoryProducts/:category", async (req, res) => {
  try {
    let category = req.params.category
    const products = await Product.find({ category: category }).sort({
      name: 1,
      category: -1
    });
    res.json({ products });
  } catch (err) {
    console.error(err);
  }
});
router.get("/api/getTrendingProducts", async (req, res) => {
  try {
    // Get all search results from different searches
    const searches = await Search.find({}, { searchResults: 1 }).populate("searchResults.productId");
    const trendingProductsArray = await sortArray(searches)

    res.json({ trendingProductsArray, searches });
  } catch (err) {
    console.error(err);
  }
});

router.get("/api/getRecentSearches", async (req, res) => {
  try {
    //Get all the searches that have an id same as the current signed in user
    const currentUser_RecentSearches = await Search.find({ userId: req.session.userId }, { createdAt: -1 }).populate("searchResults.productId")
    const recentSearches_ProductsArray = await sortArray(currentUser_RecentSearches)
    
    res.json({ recentSearches_ProductsArray, currentUser_RecentSearches });
  } catch (err) {
    console.error(err);
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    //get all the search results from differnt searches
    const searches = await Search.find({}).select("searchResults").populate("searchResults.productId")

    //filter in all search products that have vendorId equal to current userId
    let currentVendorSearches = searches.filter((data) => data.productId.vendorId === req.session.userId)
    let sortedProductsArray = await sortArray(currentVendorSearches)

    res.json({ "currentVendorSearches": currentVendorSearches, "sortedProductsArray": sortedProductsArray })

  } catch (err) {
    console.error(err);
  }
});
router.get("/api/getAllOrders", async(req, res)=>{
  let allOrders = Order.find({}, {updatedAt: -1})
})

const sortArray = async (searches) => {
  // Flatten the array of search results
  const flatArray = searches.flatMap(item => item.searchResults);

  // Get frequencies of each element
  const searchProducts = getFrequencies(flatArray);

  // Extract only the product objects (excluding frequencies)
  const sortedProductsArray = searchProducts.map(element => element.element);
  return sortedProductsArray
}



module.exports = router;
