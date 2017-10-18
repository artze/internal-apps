var fs = require('fs');
var csv = require('csv');
var del = require('del');
var Product = require('../../models').Product

module.exports = function(req, res) {
	var input = fs.createReadStream('./uploads/price-calc/' + req.file.filename)
	var parser = csv.parse({
		delimiter: ',',
		columns: true
	})
	var csvOutput = [];
	var transform = csv.transform(function(row) {
		var resultObj = {
			product_name: row['Product'],
			cogs: row['CoGS'],
			selling_price: row['U/P'],
			slope: row['Slope'],
			mpd: row['MPD'],
			cellular_type: row['Cellular type'],
			territories_operators: row['Territories/Operators'],
			spq: row['SPQ'],
			moq: row['MOQ']
		}
		csvOutput.push(resultObj)
	})

	transform.on('finish', function() {
		console.log(csvOutput);
		var responseObj = {};
		Product.destroy({ truncate: true });
		Product.bulkCreate(csvOutput, { validate: true })
			.then(function() {
				console.log('CSV file records inserted into database');
				responseObj.uploadStatus = 'Upload Successful'
				res.status(200).json(responseObj);
				del('./uploads/price-calc/*')
					.then(function(paths) {
						console.log('Deleted files: \n' + paths.join('\n'))
					})
					.catch(function(err) {
						console.log(err)
					})
			})
			.catch(function(err) {
				console.log(err);
				responseObj.uploadStatus = 'Upload Error';
				res.status(500).json(responseObj);
				del('./uploads/price-calc/*')
					.then(function(paths) {
						console.log('Deleted files: \n' + paths.join('\n'))
					})
					.catch(function(err) {
						console.log(err)
					})				
			})
	})
	input.pipe(parser).pipe(transform)
}