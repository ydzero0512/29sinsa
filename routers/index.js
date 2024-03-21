const express = require("express");

const getProduct = require("./product");

const router = express.Router();

router.use(getProduct);

module.exports = router;
