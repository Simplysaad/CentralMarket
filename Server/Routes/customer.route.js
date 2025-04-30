const express = require("express");
const router = express.Router();
const { shuffle } = require("../Utils/helper.js");
//const fetch = require("node-fetch");
const { default: fetch } = require("node-fetch");

const Product = require("../Models/product.model.js");
const User = require("../Models/user.model.js");
const Order = require("../Models/order.model.js");
const Search = require("../Models/search.model.js");
const customerController = require("../Controllers/customer.controller.js");

router.get("/", customerController.getProducts);
router.get("/home", customerController.getHomeProducts);
router.get("/products", customerController.getProducts);
//[new arrivals, top rated, deals of the day, christmas collection, clearance sales]

router.all("/search/:searchType", customerController.searchController);

router.get("/cart", customerController.getCart);
router.post("/cart/:id", customerController.postCart);
router.delete("/cart/:id", customerController.deleteCartItem);

router.get("/preview/:id", customerController.getPreview);

router.post("/order", customerController.postOrder);
router.get("/order", customerController.getOrder);
router.post("/order/massive", customerController.postOrderMassive);

router.get("/category/:categoryName", async (req, res) => {
    try {
        const { categoryName } = req.params;
        const categoryProducts = await Product.find({
            category: categoryName
        });

        const featuredProducts = categoryProducts.filter(
            product => product.isFeatured
        );

        const discountedProducts = categoryProducts.filter(
            product => product.discount?.value > 0
        );

        const subCategories = [
            ...new Set(categoryProducts.map(product => product.subCategory))
        ];
        console.log(subCategories);

        let subCategoriesElements = [];
        subCategories.forEach((subCategory, index) => {
            let subCategoryGroup = {
                name: subCategory,
                products: categoryProducts.filter(
                    product => product.subCategory === subCategory
                )
            };
            // if (subCategoryGroup.products.length >= 10)
            subCategoriesElements.push(subCategoryGroup);
        });

       // return res.status(200).json({
        return res.status(200).render("Pages/Customer/category_page.ejs",{
            categoryName,
            subCategories: subCategoriesElements,
            featuredProducts,
            discountedProducts
        });
    } catch (err) {
        console.error(err);
    }
});
module.exports = router;
