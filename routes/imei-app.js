var router = require('express').Router();
var imeiAppController = require('../controllers/imei-app');

router.get('/uploadCSV', imeiAppController.uploadCSV);
router.get('/search', imeiAppController.search);
router.get('/rework', imeiAppController.rework);
router.get('/shipdevice', imeiAppController.shipdevice);

module.exports = router;