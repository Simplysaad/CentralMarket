const express = require("express");
const router = express.Router();

const Product = require("../Models/product.model.js");
const Search = require("../Models/search.model.js");

const { searchController } = require("../Controllers/customer.controller.js");
router.all("/search", searchController);

module.exports = router;
