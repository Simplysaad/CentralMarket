
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

let suggestions = new Set()
Search.find({}, { searchTerm: 1 }).then(data => suggestions.add(data))

// Global locals object for views
const locals = {
  title: "Home | CentralMarket",
  description:
    "an incampus shopping website for school online vendors and students, to buy , sell and deliver items without hassle",
  imageUrl: "/IMG/favicon.png",
  searchSuggestions: suggestions
};


// Commented out code - consider enabling or removing
// Search.find({}, { searchTerm: 1 }).then(data => locals.searchSuggestions = data)
// Product.createIndex({
//   name: "text",
//   description: "text",
//   tags: "text",
//   category: "text",
//   subCategory: "text",
//   "vendorId.name": "text"
// }).exec()

const { getRecentSearches, getPopularProducts } = require("../Controllers/controller.js")


// Example ads array (consider moving to a configuration file or database)
const ads = [
  {
    title: "cowrywise: invest in the future",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    title: "Termux: the terminal of the century",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    title: "Barclays bank",
    imageUrl: "https://via.placeholder.com/300",
  },
];

// --- Index Route ---
router.get("/", async (req, res) => {
  try {
    const popularProducts = await getPopularProducts()
    const featuredProducts = await Product.find({ isFeatured: true }).sort({ updatedAt: -1 })
    const recentSearches = await getRecentSearches()
    const topSellingProducts = await Product.find({}).sort({ amountSold: -1 }).limit(10)
    const newArrivals = await Product.find({}).sort({ createdAt: -1 }).limit(11)
    // Get distinct categories
    const categories = await Product.distinct("category");


    res.render("Pages/homepage", {
      locals,
      ads,
      categories,
      popularProducts,
      featuredProducts,
      recentSearches,
      topSellingProducts,
      newArrivals
    })
  }
  catch (err) {
    console.error("Error in home route:", err); // More specific error message
    res.status(502).redirect("/502"); // Redirect to 502 page on error

  }
})

// --- categories Route ---
router.get("/category/", async (req, res) => {
  try {
    // Fetch products with specific fields
    const products = await Product.find(
      {},
      {
        _id: 1,
        productImage: 1,
        name: 1,
        category: 1,
        price: 1,
        currency: 1,
      }
    );
    // Get distinct categories
    const categories = await Product.distinct("category");

    // Render the index page with data
    res.render("Pages/index", {
      locals,
      ads,
      categories,
      products,
    });
  } catch (err) {
    console.error("Error in home route:", err); // More specific error message
    res.status(502).redirect("/502"); // Redirect to 502 page on error


  }
});

// --- Category Route ---
router.get("/category/:category", async (req, res) => {
  try {
    // Extract and sanitize category name from URL
    let categoryName = req.params.category;
    categoryName = categoryName.split("%20").join(" ");

    // Fetch all products for related products
    const allProducts = await Product.find({});
    const relatedProducts = relatedProductsFunc(allProducts, 8);
    const categories = await Product.distinct("category");

    // Create regex for case-insensitive search
    let regex = new RegExp(categoryName, "gi");
    // Find products by category with regex
    const categoryItems = await Product.find({
      category: regex,
    });

    locals.title = categoryName + " | CentralMarket"; // Update title

    // Render category page
    res.render("Pages/category", {
      locals,
      categoryName,
      categoryItems,
      relatedProducts,
      categories,
    });
  } catch (err) {
    console.error("Error in category route:", err); // More specific error message
    res.status(502).redirect("/502"); // Redirect to 502 page on error
    // res.json(err);  // Removing this line since redirect is already handled
  }
});

// --- Product Preview Route ---
router.get("/store/:id", async (req, res) => {
  try {
    let vendorId = req.params.id
    let categories = await Product.distinct("category")
    let vendor = await User.findOne({ _id: vendorId })

    vendor.products = await Product.find({ vendorId: vendor._id })

    let currentUser;
    if (req.session.userId)
      currentUser = await User.findOne({ _id: req.session.userId })
    else
      currentUser = {}


    locals.title = vendor.businessName + " | CentralMarket"
    locals.description = vendor.businessDesc


    res.render("Vendor/store", {
      vendor,
      currentUser,
      categories,
      locals,
    })

  }
  catch (err) {
    console.error(err)
  }
})

router.post("/store/:id", async (req, res) => {
  try {


    //this route is for the leave a message form


  }
  catch (err) {
    console.error(err)
  }
})

// --- Product Preview Route ---
router.get("/preview/:id", async (req, res) => {
  try {
    // Fetch all products for related products
    const allProducts = await Product.find({});
    const relatedProducts = relatedProductsFunc(allProducts, 8);
    const categories = await Product.distinct("category");

    // Find product by ID
    const currentProduct = await Product.findById(req.params.id);

    // Handle product not found explicitly
    if (!currentProduct) {
      console.log(`Product with ID ${req.params.id} not found`); // Log the error
      return res.status(404).redirect("/404") // Redirect to a 404 page for user
      // throw new Error("No product matches that ID"); // Throwing an error stops the execution
    }

    // Increment preview count - using findByIdAndUpdate for cleaner code
    await Product.findByIdAndUpdate(req.params.id, {
      $inc: {
        previewCount: 1
      }
    });

    locals.title = currentProduct.name + "- CentralMarket"; // Update title

    // Render product preview page
    res.render("Pages/preview", {
      locals,
      currentProduct,
      relatedProducts,
      categories,
    });
  } catch (err) {
    console.error("Error in preview route:", err);
    res.status(502).redirect("/502");
  }
});

// --- Search Route ---
router.all("/search", async (req, res) => {
  try {
    // Fetch all products (consider optimizing this query later)
    const allProducts = await Product.find({}).populate("vendorId");
    const relatedProducts = relatedProductsFunc(allProducts, 18);
    const categories = await Product.distinct("category");

    // Extract search term from query or body (handle both GET and POST)
    let { searchTerm } = req.body

    if (!req.body.searchTerm) {
      searchTerm = req.query.searchTerm
    }


    console.log("Request body:", req.body, "Request Query:", req.query, "Search Term:", searchTerm); // More useful log

    //Get userId from session
    let { userId } = req.session;
    // Sanitize and trim search term to prevent injection
    const symbols = /[</\\>&;//]/gi;
    searchTerm = searchTerm.replace(symbols, " ").trim();

    // Create regex for case-insensitive search
    let regex = new RegExp(searchTerm, "gi");

    // Search for products based on various fields using the regex
    const searchResults = await Product.find({
      $or: [
        { description: regex },
        { name: regex },
        { tags: regex },
        { category: regex },
        { subCategory: regex },
      ],
    });

    if (searchResults.length === 0) {
      console.log(searchTerm, "brought no results ");
      return res.render("Pages/empty-search", {
        searchTerm,
        categories,
        relatedProducts,
        locals,
      });
    }
    // Prepare search result objects
    let newSearchResults = [];

    searchResults.forEach((data) => {
      //data.productId = data._id; // Add productId to each result

      let productObj = {
        productId: data._id,
        matchPoint: "name", // Consider more robust matching logic
      };

      newSearchResults.push(productObj);
      //console.log(data.productId);
    });

    // Create and save new search record
    const newSearch = new Search({
      userId: userId || null, // Store userId, if available
      searchTerm,
      searchResults: newSearchResults
    });

    await newSearch.save().then(() => {
      console.log("Search data saved");
    });

    locals.title = "search For " + searchTerm + " | CentralMarket"; // Update title

    // Handle empty search results

    // Render search results page
    res.render("Pages/search.ejs", {
      searchResults,
      searchTerm,
      categories,
      locals,
    });

  } catch (err) {
    console.error("Error in search route:", err); // More specific error message
    res.status(502).redirect("/502");
  }
});

// --- Cart Route ---
router.get("/cart", async (req, res) => {
  try {
    // Fetch all products for related products
    const allProducts = await Product.find({});
    const relatedProducts = relatedProductsFunc(allProducts, 18);
    const categories = await Product.distinct("category");

    // Initialize cart if not in session
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Calculate cart total
    const cart = req.session.cart;
    const CART_TOTAL = cart.reduce(
      (acc, item) => acc + Number(item.price),
      0
    );
    console.log("CART_TOTAL", CART_TOTAL);
    // Set flag for cart empty check
    const isCartEmpty = cart.length === 0;

    locals.title = "Cart | CentralMarket"; // Update title

    // Render cart page
    res.render("Pages/cart", {
      categories,
      locals,
      isCartEmpty,
      cartItems: req.session.cart,
      CART_TOTAL: CART_TOTAL.toLocaleString(), // Format total with commas
      relatedProducts,
    });
  } catch (err) {
    console.error("Error in cart route:", err);
    res.status(502).redirect("/502");
  }
});

// --- Add to Cart Route ---
router.get("/cart/:id/add", async (req, res) => {
  try {
    // if (!req.body) throw new Error(`req.body cannot be empty`);
    console.log("req.session.cart:", req.session.cart);

    // Initialize cart if not in session
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Get customerId from session
    const customerId = req.session.userId;

    // Protect route if user is not logged in
    if (!customerId || !req.session) {
      console.error(`Customer Id not Available`);
      return res.redirect("/auth/login");
    }

    // Find the product using ID
    const currentProduct = await Product.findOne(
      { _id: req.params.id },
      { name: 1, price: 1, amountInStock: 1, vendorId: 1 }
    ).lean();
    // Handle product not found
    if (!currentProduct)
      throw new Error(`product with ID: ${req.params.id} not found`);

    // let { color = "default", size = "default", quantity = 1 } = req.query;
    let { color = "default", size = "default", quantity } = req.query;



    console.log("quantity", quantity)
    console.log("currentProduct.amountInStock", currentProduct.amountInStock)

    // Helper function to compute total price for one item
    const getPrice = (product, cartItem) =>
      Number(product.price * cartItem.quantity);

    const singleItem = {
      productId: currentProduct._id,
      color,
      size,
      quantity: Number(quantity), // ensure quantity is a number
      ...currentProduct,
    };
    console.log("singleItem:", singleItem);

    //Check if the singleItem already exists
    const cartItems = req.session.cart;
    const itemIndex = cartItems.findIndex(
      (item) =>
        item.name === singleItem.name &&
        item.color === singleItem.color &&
        item.vendorId === singleItem.vendorId
    );

    if (itemIndex < 0) {
      // Add new item to cart
      req.session.cart.push(singleItem);
    } else {
      // Update quantity and price of existing cart item
      if (!req.query.quantity)
        req.session.cart[itemIndex].quantity += 1
      else
        req.session.cart[itemIndex].quantity = singleItem.quantity;


      if (req.session.cart[itemIndex].quantity > currentProduct.amountInStock)
        req.session.cart[itemIndex].quantity = currentProduct.amountInStock


      if (req.session.cart[itemIndex].quantity === 0)
        req.session.cart.splice(itemIndex, 1);
      
      req.session.cart[itemIndex].price = getPrice(
        currentProduct,
        req.session.cart[itemIndex]
      );
    }
    // Save session
    req.session.save((err) => {
      if (err) {
        throw new Error("Error encountered while savung session");
      }
    });
    return res.redirect("/cart");
  } catch (err) {
    console.error("Error in add-cart route:", err);
    res.status(502).redirect("/502");
  }
});

// --- Remove Item from Cart Route ---
router.get("/cart/:id/remove", async (req, res) => {
  try {
    const { color = "default", size = "default" } = req.query;

    // Find item in cart
    const currentProduct = req.session.cart.find(
      (product) => product.productId === req.params.id
    );
    // Handle product not found
    if (!currentProduct)
      throw new Error(`product with ID: ${req.params.id} not found in cart`);


    const itemIndex = req.session.cart.indexOf(currentProduct);

    if (itemIndex >= 0) {
      const basePrice =
        req.session.cart[itemIndex].price /
        req.session.cart[itemIndex].quantity;

      req.session.cart[itemIndex].quantity -= 1;
      req.session.cart[itemIndex].price -= basePrice;

      // Remove item if quantity is zero or less
      if (req.session.cart[itemIndex].quantity === 0) {
        req.session.cart.splice(itemIndex, 1);
      }
    }
    // Save session
    req.session.save((err) => {
      if (err) {
        throw new Error("Error encountered while savung session");
      }
    });
    res.redirect("/cart");
  } catch (err) {
    console.error("Error in remove-item route:", err);
    res.status(502).redirect("/502");
  }
});

// --- Place Order Route ---
router.post("/order/place", async (req, res) => {
  try {
    // Get cart from session
    let cart = req.session.cart;

    // Calculate cart total
    const CART_TOTAL = cart.reduce(
      (acc, item) => acc + Number(item.price),
      0
    );
    // Calculate tax and shipping costs
    //const tax = CART_TOTAL * 0.02;
    const getShippingCost = (price) => {
      let shippingCost
      if (price <= 2000) {
        shippingCost = 0.1 * price
      }
      else if (price <= 12000 && price > 2000)
        shippingCost = 760

      else if (price > 12000)
        shippingCost = 1000

      else
        shippingCost = 1500

      return shippingCost;
    }

    const shippingCost = getShippingCost(CART_TOTAL);
    const totalCost = CART_TOTAL + shippingCost;


    // Create new order object
    const newOrder = new Order({
      customerId: req.session.userId,
      items: req.session.cart,
      subTotal: CART_TOTAL,
      shippingCost,
      totalCost,
    });

    // Save new order
    newOrder
      .save()
      .then((data) => {
        console.log({
          message: "new Order added successfully",
          data,
        });
        res.redirect("/");
      })
      .catch((err) => {
        console.error("Error saving order:", err); // More specific error message
        res.status(502).redirect("/502")
        throw new Error(err);
      });
    // Reset cart
    req.session.cart = [];
  } catch (err) {
    console.error("Error in order/place route:", err);
    res.status(502).redirect("/502");
  }
});

// --- 502 Route ---
router.get("/502", async (req, res) => {
  try {
    locals.title = "Internal Server Error | CentralMarket"
    res.render("Error/502", { layout: "Layouts/errorLayout" });
  } catch (err) {
    console.error("Error in 502 route:", err);
  }
});


// --- 404 Route ---
router.get("/*", async (req, res) => {
  try {
    res.render("Error/404", { layout: "Layouts/errorLayout" });
  } catch (err) {
    console.error("Error in 404 route:", err);
    res.status(502).redirect("/502");
  }
});


module.exports = router;
