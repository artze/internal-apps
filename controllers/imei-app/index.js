function uploadCSV(req, res) {
	res.render('imei-app/uploadCSV');
}

function search(req, res) {
	res.render('imei-app/search');
}

function rework(req, res) {
	res.render('imei-app/rework');
}

function shipdevice(req, res) {
	res.render('imei-app/shipdevice');
}

module.exports = {
	uploadCSV: uploadCSV,
	search: search,
	rework: rework,
	shipdevice: shipdevice
}