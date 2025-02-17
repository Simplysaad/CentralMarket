const User = require("../Models/User");
const Product = require("../Models/Product");
const Order = require("../Models/Order");
//const fetch = require("node-fetch");

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

/**
 * getFrequencies function
 * takes the array in question as a parameter
 * used to get the frequencies of elements in an Array
 * then create an object for each distinct element
 * then sort the objects by their frequencies
 * then return the sorted array of objects
 */

// const getFrequencies = (arr) => {
//   //let totalArray = arr.flat()
//   let freqMap = {}
//   arr.forEach(element => {
//     if (freqMap[element]) {
//       freqMap[element]++
//     }
//     else {
//       freqMap[element] = 1
//     }
//   })

//   let frequencyTable = Object.keys(freqMap).map(key =>
//   ({
//     element: key,
//     frequency: freqMap[key]
//   })
//   )
//   let sortedArray = frequencyTable.sort((a, b) => b.frequency - a.frequency)

//   //console.log(arr, freqMap, sortedArray)
//   return sortedArray
// }

const getFrequencies = arr => {
    const freqMap = arr.reduce((acc, element) => {
        acc[element] = (acc[element] || 0) + 1;
        return acc;
    }, {});

    const frequencyTable = Object.entries(freqMap).map(
        ([element, frequency]) => ({
            element,
            frequency
        })
    );

    // Sort the frequency table by frequency in descending order
    return frequencyTable.sort((a, b) => b.frequency - a.frequency);
};

const sortArray = async searches => {
    // Flatten the array of search results
    const flatArray = searches.flatMap(item => item.searchResults);

    // Get frequencies of each element
    const searchProducts = getFrequencies(flatArray);

    // Extract only the product objects (excluding frequencies)
    const sortedProductsArray = searchProducts.map(element => element.element);
    return sortedProductsArray;
};

const getAge = timestamp => {
    const units = [
        {
            name: "year",
            factor: 365 * 24 * 60 * 60 * 1000
        },
        {
            name: "month",
            factor: 30 * 24 * 60 * 60 * 1000
        },
        {
            name: "week",
            factor: 7 * 24 * 60 * 60 * 1000
        },
        {
            name: "day",
            factor: 24 * 60 * 60 * 1000
        },
        {
            name: "hour",
            factor: 60 * 60 * 1000
        },
        {
            name: "minute",
            factor: 60 * 1000
        }
    ];

    let interval = Date.now() - timestamp;

    for (const unit of units) {
        let age = Math.floor(interval / unit.factor);
        if (age > 0) {
            console.log(`${age} ${age > 1 ? unit.name + "s" : unit.name} ago`);
            break;
        }
    }
};

const uploadToImgur = async file => {
    /**
     * 
     */
    try {
    //  console.log(file)
        let url = "https://api.imgur.com/3/upload";
        let formData = new FormData();
        let newBlob = new Blob([file.data])
        formData.append("image", new Blob([file.data]), file.name);

        let response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: "Client-ID e2b328ad29f2fa8"
            },
            body: formData
        });
        let responseJson = await response.json();
        console.log("responseJson", responseJson)
        let { link, title, description } = responseJson.data;

        return { link, title, description };
    } catch (err) {
        console.error(err);
    }
};




// const uploadToImgur = async (files) => {
//   const imgurUploads = [];
//   for (const file of files) {
//     try {
//       let url = "https://api.imgur.com/3/upload";
//       let formData = new FormData();
//       formData.append("image", new Blob([file.data]), file.name);
//       let response = await fetch(url, {
//         method: "POST",
//         headers: {
//           Authorization: "Client-ID e2b328ad29f2fa8"
//         },
//         body: formData
//       });
//       let responseJson = await response.json();
//       console.log("responseJson", responseJson)
//       let { link, title, description } = responseJson.data;
//       imgurUploads.push({ link, title, description });
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   return imgurUploads;
// }
// 



module.exports = {
    relatedProductsFunc,
    readTime,
    destroySession,
    getFrequencies,
    sortArray,
    getAge,
    uploadToImgur
};
