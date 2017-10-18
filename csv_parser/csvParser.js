var fs = require('fs');
var csv = require('csv');
var del = require('del');
var Device = require('../models').Device

// passing in response object as argument for vuejs
module.exports = function(req, res) {
	var input = fs.createReadStream('./uploads/' + req.file.filename)
	var parser = csv.parse({
		delimiter: ',',
		columns: true
	})
	var csvOutput = [];
	var transform = csv.transform(function(row) {
		var resultObj = {
			model_name: row['Model Name'],
			imei: row['IMEI#'],
			serial_number: row['S/N#'],
			meid: row['MEID#'],
			esn: row['ESN#'],
			mac_address: row['MAC#'],
			exfactory_date: row['Ex-Factory date'].slice(6, 10) + '-' + row['Ex-Factory date'].slice(3, 5) + '-' + row['Ex-Factory date'].slice(0, 2),
			po_number: row['MEW PO#'],
			packaging_number: row['CN#'] ,
			sw_version: row['Software version'],
			fw_version: row['FW version'],
			hw_version: row['S/N#'].slice(0, 2)
		}
		if(!resultObj.imei) {
			resultObj.imei = null;
		}
		if(!resultObj.meid) {
			resultObj.meid = null;
		}
		if(!resultObj.esn) {
			resultObj.esn = null;
		}
		if(!resultObj.mac_address) {
			resultObj.mac_address = null;
		}
		if(!resultObj.packaging_number) {
			resultObj.packaging_number = null;
		}
		csvOutput.push(resultObj)
	})

	transform.on('finish', function() {
		var responseObj = {};
		Device.bulkCreate(csvOutput, { validate: true })
			.then(function() {
				console.log('CSV file records inserted into database');
				responseObj.uploadStatus = 'Upload Successful'
				res.status(200).json(responseObj);
				del('./uploads/*')
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
				if(err[0]) {
					responseObj.errorMessage = err[0].errors.message
				} else if(err.errors[0].message === 'imei_UNIQUE must be unique') {
					responseObj.errorMessage = 'Duplicate IMEIs detected!';
				}
				res.status(500).json(responseObj);
				del('./uploads/*')
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