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
        category: "Home & Kitchen"
      },
      {
        $set: {
          category: "Home and Kitchen"
        }
      }
    );
    await Product.updateMany(
      {
        category: "Sports & Outdoors"
      },
      {
        $set: {
          category: "Sports and Outdoors"
        }
      }
    );
    await Product.updateMany(
      { category: "Food & Drinks" },
      {
        $set: {
          category: "Food and Drinks"
        }
      }
    );
    await Product.updateMany(
      { category: "Beauty & Personal Care" },
      {
        $set: {
          category: "Beauty and Personal Care"
        }
      }
    );


    return res.send("suvcessful")
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

router.get("/api/getMostSearchedProduct", async (req, res) => {
  try {
    // Get all search results from different searches
    // const searches = await Search.find({}, { searchResults: 1 }).populate("searchResults.productId");

    let currentUserId = req.session.userId
    currentUserId = new mongoose.Types.ObjectId(currentUserId)

    // let searches = await Search.find({})
    //       .populate({
    //         path: "searchResults.productId",
    //         match: { "vendorId": "6742252b65827286880886c0" },
    //         select: "_id name vendorId price"
    //       })
    //const trendingProductsArray = await sortArray(searches)

    let searches = await Search.aggregate([
      { unwind: "searchResults" },
      {
        lookup: {
          from: "products",
          localField: "searchResults.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { unwind: "product" },
      {
        match: {
          "product.vendorId": currentUserId
        }
      },
      {
        group: {
          _id: "_id",
          searchTerm: { first: "searchTerm" },
          searchResults: { push: "searchResults" }
        }
      }

    ])
    res.json({ searches });
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
    // if (!req.session.userId) {
    //       return res.redirect("/login");
    //     } else if (req.session.role !== "vendor") {
    //       console.log("role", req.session.role);
    //       return res.redirect("/");
    //     }



    //get all the search results from differnt searches
    const searches = await Search.find({}).select("searchResults").populate("searchResults.productId")

    //filter in all search products that have vendorId equal to current userId
    let currentVendorSearches = searches.filter((data) => data.productId.vendorId === req.session.userId)
    let sortedProductsArray = await sortArray(currentVendorSearches)


    const currentUser = await User.findById(req.session.userId).lean();
    console.log("currentUser", currentUser.usernname, currentUser.role);
    if (!currentUser) {
      return res.status(404).json({ message: "user not found" });
    }

    await Product.updateMany({ vendorId: currentUser._id }, {
      $inc: { amountSold: 4 }
    })




    // res.render("Vendor/dashboard", {
    //   locals,
    //   currentUser,
    //   currentUserProducts
    // });
  } catch (err) {
    console.error(err);
  }
});
router.get("/api/dashboard", async (req, res) => {
  try {

    let currentUser = await User.findOne({ emailAddress: 'saadidris70@gmail.com' })
    console.log("currentUser", currentUser)
    // await Order.createIndex({ "items.vendorId": 1 });

    // ✓ currentUser.products = currentUserProducts
    // //PRODUCTS: all products with vendorId equal to current user
    const currentUserProducts = await Product.find({
      vendorId: currentUser._id
    }).sort({ amountSold: -1 });
    // console.log("currentUserProducts", currentUserProducts);



    // ✓ currentUser.totalSales = totalSales
    // //TOTAL_SALES: sum total amount of product sales
    const totalSales = currentUserProducts.reduce((product, acc) => {
      return acc + product.price * product.amountSold;
    }, 0);
    //console.log("totalSales", totalSales);



    // currentUser.orders = currentUserOrders
    // //ORDERS: all orders with my products involved

    //const currentUserOrders = await Order.find({"items.vendorId": "6740d04ac149cb7eb672e8f7"})
    //const currentUserOrders = await Order.find({"items.vendorId": "6742252b65827286880886c0"})


    console.log("currentUser._id", currentUser._id)
    const currentUserOrders = await Order.aggregate([

      // Step 1: Use index to filter orders with at least one matching item
      { $match: { "items.vendorId": currentUser._id } },
      { $sort: { "updatedAt": -1 } },
      // Step 2: Break the items array into individual documents
      { $unwind: "$items" },
      //  Step 3: Filter to retain only the vendor's items
      { $match: { "items.vendorId": currentUser._id } },
      //Step 4: Reshape the output
      {
        $project: {
          _id: 0,
          orderId: "$_id",
          item: "$items",
          deliveryStatus: 1,
          updatedAt: 1
        }
      }
    ]);
    // console.log("currentUserOrders", currentUserOrders)

    const currentUserOrdersValue = currentUserOrders.reduce((acc, elem) => {
      return acc + elem.item.price
    }, 0)
    //console.log("currentUserOrdersValue", currentUserOrdersValue)


    // currentUser.completedOrders = currentUserOrders
    // //COMPLETED_ORDERS: all orders with my products involved with deliveryStatus = "completed"

    let completedOrders = currentUserOrders.filter(item => item.deliveryStatus === "completed")
    //console.log("completedOrders", completedOrders)

    // currentUser.growth = currentUserGrowth
    // //GROWTH: change in sales over total sales


    // currentUser.mostSearched = bestPerformingProduct
    // //MOST_SEARCHED: current User product with the highest show up in search results

    const currentUserPopularProducts = await Search.aggregate([
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
        $match: {
          "items.vendorId": currentUser._id
        }
      },
      {
        $group: {
          "_id": "$items._id",
          "productName": { $first: "$items.name" },
          "vendor": { $first: "$items.vendorId" },
          "searchCount_Sum": { "$sum": 1 },
          "searchCount_Count": { "$count": {} }
        }
      },
      {
        $sort: {
          "searchCount_Count": -1
        }
      }
    ])
    

    return res.json({
      // currentUserOrders,
      //  currentUserOrdersValue,
      // completedOrders,
      currentUserPopularProducts
    })
  }
  catch (err) {
    console.error(err);
  }
})
router.get("/api/getAllOrders", async (req, res) => {
  let allOrders = Order.find({}, { updatedAt: -1 })
})

const getFrequencies = (array) => {
  const frequencies = {};
  array.forEach((element) => {
    frequencies[element] = (frequencies[element] || 0) + 1;
  });
  return Object.keys(frequencies).map((key) => ({
    element: key,
    frequency: frequencies[key],
  }));
};


const sortArray = async (searches) => {
  // Flatten the array of search results
  const flatArray = searches.flatMap(item => item.searchResults);

  // Get frequencies of each element
  const searchProducts = getFrequencies(flatArray);

  // Extract only the product objects (excluding frequencies)
  const sortedProductsArray = searchProducts.map(element => element.element);
  return sortedProductsArray
}