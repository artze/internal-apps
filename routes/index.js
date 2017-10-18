var imeiAppRoute = require('./imei-app');
var priceCalcRoute = require('./price-calc');

function init(app) {
	app.get('/', function(req, res) {
		res.render('index');
	});

	app.use('/imei-app', imeiAppRoute);

	app.use('/price-calc', priceCalcRoute);
}

module.exports = {
	init: init
}