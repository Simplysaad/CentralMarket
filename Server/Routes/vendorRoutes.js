const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../Models/User.js");
const Product = require("../Models/Product.js");
const Order = require("../Models/Order.js");
const Search = require("../Models/Search.js");
const Review = require("../Models/Review.js");

const authMiddleware = require("../Utils/auth.js");
const helper = require("../Utils/helper");
const getCategories = async query => {
  categoriesPromise = await Product.distinct(query);
  return categoriesPromise;
};

const { sortArray } = require("../Utils/helper.js")

var categories;
getCategories("category").then(data => {
  categories = data;
});

var subCategories;
getCategories("subCategory").then(data => {
  subCategories = data;
});

const multer = require("multer");

const productStorage = multer.diskStorage({
  destination: "Uploads/Products",
  filename: function (req, file, cb) {
    let myFileName = Date.now() + "_" + file.originalname;
    cb(null, myFileName);
  }
});
const uploadProduct = multer({
  storage: productStorage
});

const userStorage = multer.diskStorage({
  destination: "Uploads/Users",
  filename: function (req, file, cb) {
    let myFileName = Date.now() + "_" + file.originalname;
    cb(null, myFileName);
  }
});
const uploadUser = multer({
  storage: userStorage
});


const locals = {
  title: "Vendor | CentralMarket",
  description:
    "an incampus shopping website for school online vendors and students, to buy , sell and deliver items without hassle",
  imageUrl: "/IMG/favicon.png"
};

Search.find({}, { searchTerm: 1 }).then(data => locals.searchSuggestions = data)


router.use((req, res, next) => {
  res.locals.layout = "Layouts/vendorLayout";
  next();
});

router.use(authMiddleware);

router.get("/dashboard", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/login");
    } else if (req.session.role !== "vendor") {
      console.log("role", req.session.role);
      return res.redirect("/");
    }

    const currentUser = await User.findOne({ _id: req.session.userId })
    console.log("currentUser", currentUser.username, currentUser.role);

    if (!currentUser) {
      return res.status(404).json({ message: "user not found" });
    }


    // ✓ currentUser.products = currentUserProducts
    // //PRODUCTS: all products with vendorId equal to current user
    const currentUserProducts = await Product.find({
      vendorId: currentUser._id
    }).sort({ amountSold: -1 });
    //
    currentUser.products = currentUserProducts


    // currentUser.totalSales = totalSales
    // //TOTAL_SALES: sum total amount of product sales
    //console.log("currentUserProducts", currentUserProducts);

    // const totalSales = currentUserProducts.reduce((product, acc) => {
    //   console.log("product", product )
    //   console.log("product.price", product.price )
    //   console.log("product.amountSold", product.amountSold )

    //   return acc + (product.price * product.amountSold);
    // }, 0);
    let totalSales = 0;
    currentUserProducts.forEach(product => {
      console.log("product.price", product.price)
      console.log("product.amountSold", product.amountSold)

      return totalSales += (product.price * product.amountSold)
    })
    console.log("totalSales", totalSales);
    currentUser.totalSales = totalSales


    // currentUser.orders = currentUserOrders
    // ORDERS: change in sales over total sales
    const currentUserOrders = await Order.aggregate([

      // Step 1: Use index to filter orders with at least one matching item
      { $match: { "items.vendorId": currentUser._id } },
      { $sort: { "updatedAt": -1 } },
      // Step 2: Break the items array into individual documents
      { $unwind: "$items" },
      //  Step 3: Filter to retain only the vendor's items
      { $match: { "items.vendorId": currentUser._id } },

      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      //Step 4: Reshape the output
      {
        $project: {
          _id: 0,
          customer: "$customer.username",
          orderId: "$_id",
          item: "$items",
          broughtIn: "$items.broughtIn",
          product: 1,
          deliveryStatus: 1,
          updatedAt: 1
        }
      }
    ]);
    currentUser.orders = currentUserOrders
    // console.log("currentUserOrders", currentUserOrders)

    // currentUser.completedOrders = currentUserOrders
    // //COMPLETED_ORDERS: all orders with my products involved with deliveryStatus = "completed"
    const completedOrders = currentUserOrders.filter((order) => order.deliveryStatus === "delivered")
    currentUser.completedOrders = completedOrders

    // currentUser.mostSearched = bestPerformingProduct
    // MOST_SEARCHED: current User product with the highest show up in search results
    const mostSearched = await Search.find({}, { searchResults: 1 }).populate("searchResults.productId");
    const mostSearchedProducts = await sortArray(mostSearched)
    //console.log("mostSearched", mostSearchedProducts)

    // currentUser.growth = currentUserGrowth
    // GROWTH: change in sales over total sales


    res.render("Vendor/dashboard", {
      locals,
      currentUser,
      MostSearchedProduct: mostSearchedProducts[0],
      categories
    });
  } catch (err) {
    console.error(err);
  }
});
router.get("/products/", async (req, res) => {
  try {
    let currentUserId = req.session.userId || null

    const currentUserProducts = await Product.find({ vendorId: currentUserId }, { name: 1, price: 1, discount: -1 })
    return res.json({ currentUserProducts })
  }
  catch (err) {
    console.error(err)
  }
})

router.get("/products/add", async (req, res) => {
  try {
    console.log("categories: ", categories);
    res.render("Vendor/add_product", { locals, categories, subCategories });
  } catch (err) {
    console.error(err);
  }
});
router.post("/products/add", uploadProduct.single("productImage"), async (req, res) => {
  try {
    const { productTags, basePrice, discount } = req.body;
    let productImage
    //if (req.file) {
    productImage = req.file.filename || "https://via.placeholder.com/300"
    //}else {
    // productImage = "https://via.placeholder.com/300"
    //}
    const refinedTags = productTags.split(",");
    console.log("refinedTags", refinedTags);

    let finalPrice;
    if (discount) finalPrice = basePrice * (discount / 100);
    else finalPrice = basePrice;

    const newProduct = new Product({
      vendorId: req.session.userId,
      productImage,
      tags: refinedTags,
      price: basePrice,
      name: req.body.productName,
      ...req.body
    });
    newProduct
      .save()
      .then(data => {
        res.redirect("/vendor/dashboard");
        console.log({
          message: "new product added successfully",
          newProduct: newProduct,
          "req.body": req.body
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "error encountered while adding new product",
          advice: " please try again later"
        });
        throw new Error(err);
      });
    //res.json({ newProduct: newProduct, "req.body": req.body });
  } catch (err) {
    console.error(err);
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const currentUserId = req.session.userId
    const currentUser = await User.findOne({ _id: currentUserId })

    if (!currentUserId || !currentUser)
      return res.redirect("auth/login")


    // currentUser.orders = currentUserOrders
    // //ORDERS: all orders with my products involved
    let currentOrderId = new mongoose.Types.ObjectId(req.params.id)


    //.find({"_id": currentOrderId})
    const currentUserOrders = await Order.aggregate([

      // Step 1: Use index to filter orders with at least one matching item
      { $match: { "_id": currentOrderId } },

      // Step 2: Break the items array into individual documents
      //  Step 3: Filter to retain only the vendor's items

      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer"
        }
      },
      { $unwind: "$items" },
      { $match: { "items.vendorId": currentUser._id } },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      //Step 4: Reshape the output
      {
        $project: {
          _id: 0,
          customer: { $first: "$customer.username" },
          orderId: "$_id",
          item: "$items",
          broughtIn: "$items.broughtIn",
          product: { $first: "$product" },
          deliveryStatus: 1,
          updatedAt: 1
        }
      }
    ]);
    console.log("currentUserOrders", currentUserOrders)

    return res.render("Vendor/preview_order", {
      locals,
      categories,
      currentOrder: currentUserOrders[0]
    })
  }
  catch (err) {
    console.error(err)
    return res.json({
      "message": err.message,
      "stack": err.stack
    })
  }
})
module.exports = router;
