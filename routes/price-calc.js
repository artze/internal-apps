var router = require('express').Router();
var priceCalcController = require('../controllers/price-calc');
var priceCalcApiController = require('../controllers/price-calc/apiController');
// route for pages
router.get('/', priceCalcController.priceCalc);
router.get('/uploadCSV', priceCalcController.uploadCSV);

// api routes

// upload CSV
router.post('/api/upload', priceCalcApiController.upload);

// Populate product list
router.get('/api/product/index', priceCalcApiController.productIndex)

// Get product info
router.get('/api/product/show/:product_name', priceCalcApiController.productShow)

module.exports = router;