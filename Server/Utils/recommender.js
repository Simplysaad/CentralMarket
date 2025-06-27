//import { dummyProducts } from "./dummy.js";
const Product = require("../Models/product.model.js");
async function getProducts() {
    try {
        return await Product.find({}).select(
            "_id name keywords price discount imageUrl"
        );
    } catch (err) {
        console.error(err);
    }
}

/**
 * Gets related products based on keyword matching. This function:
 * - Finds all products that have at least one tag in common with the given product(s)
 * - Counts the number of keywords they have in common (score)
 * - Sorts the results based on scores in descending order
 *
 * @param {string|string[]} productIds - A single product ID or an array of product IDs.
 * @returns {Promise<object[]|object[][]>} An array of related products (or an array of arrays if productIds is an array).
 * @description Each related product object contains an ID, tags (keywords), and a score indicating the number of matching keywords.
 * @throws {Error} If an error occurs while processing the product IDs.
 * @example
 * recommender(12);
 * recommender([12, 13, 14]);
 */

async function recommender(productIds) {
    try {
        const products = await getProducts();
        console.log(productIds);
        //const products = dummyProducts;

        const isArray = Array.isArray(productIds);
        const productIdArray = isArray ? productIds : [productIds];
        const promises = productIdArray.map(async productId => {
            const currentProduct = products.find(
                p => p._id.toHexString() === productId
            );
            if (!currentProduct) return [];

            console.log(currentProduct);

            const { keywords } = currentProduct;
            return products
                .filter(p => p._id !== productId)
                .map(p => ({
                    _id: p._id,
                    name: p.name,
                    keywords: p.keywords,
                    price: p.price,
                    imageUrl: p.imageUrl,
                    discount: p.discount,
                    score: keywords.filter(k => p.keywords.includes(k)).length
                }))
                .filter(p => p.score > 0)
                .sort((a, b) => b.score - a.score);
        });

        const matchingProducts = await Promise.all(promises);
        const result = isArray ? matchingProducts : matchingProducts[0];
        console.log(result);
        return result;
    } catch (err) {
        console.error(err);
    }
}
module.exports = recommender;
