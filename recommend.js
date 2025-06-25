fetch("dummy.json")
    .then(response => {
        console.log(response);
        return response.text();
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));

async function getRelated(name) {
    try {
        // const dummyData = await fetch("dummy.json");
        // console.log(dummyData);
        // const allProducts = await dummyData.json();
        // console.log(allProducts);

        let matchingProducts = new Array();
        let currentProduct = allProducts.find(product => product.name === name);

        let { keywords } = currentProduct;
        allProducts.forEach((product, index) => {
            product.score = 0;
            for (i = 0; i < keywords.length; i++) {
                if (product.keywords.includes(keywords[i])) {
                    product.score += 1;
                }
            }
            if (product.score > 0) {
                matchingProducts.push(product);
            }
            matchingProducts.sort((a, b) => b.score - a.score);
        });
        console.log(matchingProducts);
        return matchingProducts;
    } catch (err) {
        console.error(err);
    }
}
getRelated("laptop repair service").catch(err => console.error(err));
/**
 * GET ALL PRODUCTS THAT HAVE AT LEAST ONE TAG IN COMMON
 * COUNT HOW MANY KEYWORDS THEY HAVE IN COMMON (SCORE)
 * SORT THE RESULTS BASED ON SCORES IN DESCENDING ORDER
 */
