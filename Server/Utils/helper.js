const User = require("../Models/User");
const Product = require("../Models/Product");
const Order = require("../Models/Order");

//helper functions
const relatedProductsFunc = (arr, n) => {
    let relatedProducts = new Array();
    for (let i = 0; i < n; i++) {
        let randomIndex = Math.floor(Math.random() * arr.length);

        if (!relatedProducts.includes(arr[randomIndex])) {
            relatedProducts.push(arr[randomIndex]);
        }
    }
    // console.log(relatedProducts)
    return relatedProducts;
};

const readTime = content => {
    const words = content.split(" ").length;
    const speed = 200;

    const readTime = Math.ceil(words / speed) + " min read";

    return readTime;
};

const findProducts = async query => {
    let products = await Product.find(query);
    return products;
};
// const getCategories = async ()=>{
//   let categories = await Product.distinct("category")

//   console.log("getCategories()", categories)
//   return categories
// }
// const allProducts = findProducts({})

// var categories  = getCategories().then(data=>{
//   console.log("getCategories()", categories)
//   return data
// })
//const relatedProducts = relatedProductsFunc(allProducts, 12);

const getCategories = async () => {
    categoriesPromise = await Product.distinct("category");
    //console.log("categoriesPromise()", categoriesPromise);
    return categoriesPromise;
};

function destroySession() {
    req.session.destroy(err => {
        if (!err) {
            console.log("session destroyed");
        }
    });
}

async function createIndexes() {
    try {
        await Product.createIndexes([
            {
                name: "productTextIndex",
                key: { name: "text", description: "text" }
            }
            // ,{ name: "categoryIndex", key: { category: 1 } },
            // { name: "subCategoryIndex", key: { subCategory: 1 } },
            // { name: "priceIndex", key: { price: 1 } },
            // { name: "amountInStockIndex", key: { amountInStock: 1 } },
            // { name: "tagsIndex", key: { tags: 1 } },
            // { name: "isFeaturedIndex", key: { isFeatured: 1 } },
            // { name: "vendorIdIndex", key: { vendorId: 1 } },
            // {
            //     name: "variationsIndex",
            //     key: {
            //         "variations.size": 1,
            //         "variations.color": 1,
            //         "variations.price": 1
            //     }
            // }
        ]);
        console.log("Indexes created successfully!");
    } catch (error) {
        console.error("Error creating indexes:", error);
    }
}

module.exports = {
    relatedProductsFunc,
    readTime,
    destroySession
};
