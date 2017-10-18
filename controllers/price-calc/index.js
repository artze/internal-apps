function priceCalc(req, res) {
	res.render('price-calc/price-calc');
}

function uploadCSV(req, res) {
	res.render('price-calc/uploadCSV');
}

module.exports = {
	priceCalc: priceCalc,
	uploadCSV: uploadCSV
}