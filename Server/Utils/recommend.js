const Product = require("../Models/product.model.js");

const ContentBasedRecommender = require("content-based-recommender");
const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: 100
});

Product.find().then(products => {
    recommender.train(products);

    let randomIndex = Math.ceil(Math.random() * products.length);
    let sampleProduct = products[randomIndex];

    //get top 10 similar items to document 1000002
    const similarDocuments = recommender.getSimilarDocuments(
        sampleProduct._id,
        0,
        10
    );

    console.log(sampleProduct, similarDocuments);
});
