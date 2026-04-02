const express = require('express');
const router = express.Router();
const { getProducts, getProductByPartCode } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:partCode', getProductByPartCode);

module.exports = router;
