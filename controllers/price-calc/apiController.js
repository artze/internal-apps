var multer = require('multer')
var path = require('path');
var csvParser = require('../../csv_parser/price-calc/csvParser');
var Product = require('../../models').Product;

var multerUpload = multer({
	fileFilter: function(req, file, callback) {
		if(path.extname(file.originalname) !== '.csv') {
			return callback(new Error('Only	csv files allowed!'));
		}
		callback(null, true)
	},
	dest: './uploads/price-calc'
}).single('csvFile')


// upload CSV
function upload(req, res) {
	multerUpload(req, res, function(err) {
		if(err) {
			return res.send('Wrong File Type');
		}
		csvParser(req, res);
	})
}

function productIndex(req, res) {
	Product.findAll({ attributes: ['product_name'] })
		.then(function(productNames) {
			res.status(200).json(productNames.map(function(value) {
				return value.product_name;
			}))
		})
		.catch(function(err) {
			console.log(err);
			res.status(500).end(err);
		})
}

function productShow(req, res) {
	Product.findOne({
		where: { product_name: req.params.product_name }, 
		attributes: ['product_name', 'cogs', 'selling_price', 'slope', 'mpd', 'cellular_type', 'territories_operators']
	})
		.then(function(product) {
			console.log(product);
			res.status(200).json(product);
		})
		.catch(function(err) {
			console.log(err);
			res.status(500).end(err);
		})
}

module.exports = {
	upload: upload,
	productIndex: productIndex,
	productShow: productShow
}