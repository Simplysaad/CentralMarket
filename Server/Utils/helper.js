const employees = ["saad", "ishaq", "muadh", "john", "israel", "miracle"];
//length = 6
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
//length = 5

let randomArray = [];
function generateRandom(count) {
    if (!count) return;
    //console.log("count", count);

    //console.log(randomArray);

    for (let i = 0; i <= 100; i++) {
        let randomIndex = Math.floor(Math.random() * count);
        //console.log(randomIndex);

        let isExist = randomArray.includes(randomIndex);
        if (!isExist) {
            randomArray.push(randomIndex);
        }
    }
    //console.log("random array", randomArray);
    return randomArray;
}
//generateRandom();
exports.shuffle = array => {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Swap elements
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex]
        ];
    }

    return array;
};

// Example usage:
// const arr = [1, 2, 3, 4, 5];
// console.log(shuffle(arr)); // Output: [3, 1, 5, 4, 2] (order will vary)

// exports.shuffle = (currentArray, maxCount) => {

//     let randomArray = generateRandom(currentArray.length);

//     let shuffledArray = [];
//     randomArray.forEach(randomIndex => {
//         if (maxCount && randomArray.length > maxCount) return;
//         else shuffledArray.push(currentArray[randomIndex]);
//     });
// console.log(shuffledArray)
//     return shuffledArray;
// };

// function multiply(currentArray, count) {
//     //console.log("currentArray", currentArray);
//     let newArray = [];
//     for (i = 0; i < count; i++) {
//         newArray = newArray.concat(currentArray);
//         console.log(i, newArray);
//     }
//     let shuffledArray = shuffle(newArray);
//     console.log(shuffledArray);
// }
// //multiply(employees, 4);

// //shuffle(employees);

// const multer = require("multer");
// const { cloudinary } = require("cloudinary").v2;
// const upload = multer({ dest: "./uploads" });

// const uploadImage = async () => {
//     try {
//         const cloudinary_response = await cloudinary.uploader.upload(
//             req.file.path
//         );
//         if (cloudinary_response.ok)
//             return res.json({
//                 message: "image uploaded successfully",
//                 cloudinary_response
//             });
//     } catch (err) {}
// };

// module.exports = {
//     shuffle,
//     uploadImage,
//     multiply,
//     generateRandom
// };
exports.generate_random_color = () => {
    let color = "#";
    let characters = "0123456789ABCDEF";

    for (let i = 0; i < 8; i++) {
        color += characters[Math.floor(Math.random() * 16)];
        //console.log(color);
    }
    //console.log(`rgb(${colors}, 255)`);
};
//generate_random_color();
/** @format */

const User = require("../Models/User");
const Product = require("../Models/Product");
const Order = require("../Models/Order");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

/**
 * Sends an email using a predefined template.
 *
 * @param {string} subject - The subject of the email.
 * @param {string} recipient - The recipient's email address.
 * @param {string} template - The path to the mail template ejs file
 * @param {object} data - The data to be rendered in the email template.
 * @param {string} text - The plain text version of the email.
 *
 * @returns {Promise<void>}
 */
const sendMessage = async (subject, recipient, template, data, text) => {
    try {
        const htmlContent = await ejs.renderFile(
            path.resolve(__dirname, template || "../../Test/mail-template.ejs"),
            data || {}
        );
        //let htmlFile = "../../Test/mail-template.html";
        // let htmlContent = fs.readFileSync(
        //     path.resolve(__dirname, htmlFile),
        //     "utf8"
        // );
        const mailOptions = {
            from: process.env.GMAIL_USER,
            bcc: [recipient],
            subject,
            text,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email Sent", info);
        return info;
    } catch (err) {
        console.error(err);
    }
};

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
        let newBlob = new Blob([file.data]);
        formData.append("image", new Blob([file.data]), file.name);

        let response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: "Client-ID e2b328ad29f2fa8",
                "Content-Type": "application/octet-stream"
            },
            body: formData
        });
        let responseJson = await response.json();
        console.log("responseJson", responseJson);
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

// module.exports = {
//     relatedProductsFunc,
//     readTime,
//     destroySession,
//     getFrequencies,
//     sortArray,
//     getAge,
//     uploadToImgur,
//     sendMessage
// };
