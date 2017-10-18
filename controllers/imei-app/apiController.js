var multer = require('multer')
var csvParser = require('../../csv_parser/csvParser');
var path = require('path');
var Device = require('../../models').Device;
var ReworkConfig = require('../../models').ReworkConfig;
var Shipment = require('../../models').Shipment;

var upload = multer({
	fileFilter: function(req, file, callback) {
		if(path.extname(file.originalname) !== '.csv') {
			return callback(new Error('Only	csv files allowed!'));
		}
		callback(null, true)
	},
	dest: './uploads'
}).single('csvFile')

module.exports = function(app) {
	// upload CSV
	app.post('/api/upload', function(req, res) {
		upload(req, res, function(err) {
			if(err) {
				return res.send('Wrong File Type')
			}
			csvParser(req, res);
		})
	});

	// search device info
	app.get('/api/device/:id', function(req, res) {
		var responseObj = {};
		if(/^\d{15}$/.test(req.params.id)) {
			Device.findOne({ where: {imei: req.params.id} })
				.then(function(device) {
					if(!device) {
						return res.status(404).end();
					}
					responseObj.deviceInfo = device;
					device.getReworkConfig()
						.then(function(reworkConfig) {
							responseObj.reworkConfig = reworkConfig;
							res.status(200).json(responseObj);
						})
						.catch(function(err) {
							console.log(err);
							res.status(500).end(err);
						})
				})
				.catch(function(err) {
					console.log(err);
					res.status(500).end(err);
				})
		} else {
			Device.findOne({ where: {serial_number: req.params.id} })
				.then(function(device) {
					if(!device) {
						return res.status(404).end();
					}
					responseObj.deviceInfo = device;
					device.getReworkConfig()
						.then(function(reworkConfig) {
							responseObj.reworkConfig = reworkConfig;
							res.status(200).json(responseObj);
						})
						.catch(function(err) {
							console.log(err);
							res.status(500).end(err);
						})
				})
				.catch(function(err) {
					console.log(err);
					res.status(500).end(err);
				})
		}
	})

	// create rework config
	app.post('/api/reworkconfig/create', function(req, res) {
		ReworkConfig.create({
			script: req.body.script,
			sw_version: req.body.sw_version,
			fw_version: req.body.fw_version,
			notes: req.body.notes
		})
			.then(function() {
				res.status(200).end('Config created')
			})
			.catch(function(err) {
				if(err.errors[0].path === 'script_UNIQUE') {
					res.status(500).end('Script name already exists')
				}
			})
	})

	// get all rework configs in database
	app.get('/api/reworkconfig/index', function(req, res) {
		ReworkConfig.findAll({ attributes: ['script'] })
			.then(function(reworkConfigs) {
				res.json(reworkConfigs.map(function(value) {
					return value.script
				}))
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).end(err);
			})
	})

	// show rework config details
	app.get('/api/reworkconfig/show/:script', function(req, res) {
		ReworkConfig.findOne({ where: {script: req.params.script} })
			.then(function(reworkConfig) {
				res.status(200).json(reworkConfig);
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).end(err);
			})
	})

	// update device with rework config
	app.patch('/api/device/updaterework', function(req, res) {
		var reworkConfigId = '';
		var responseObj = {};
		ReworkConfig.findOne({ where: {script: req.body.script} })
			.then(function(reworkConfig) {
				reworkConfigId = reworkConfig.id
				if(req.body.imei) {
					Device.update({ rework_config_id: reworkConfigId, rework_date: req.body.reworkDate }, { where: { imei: req.body.imei } })
						.then(function(updatedDevices) {
							if(updatedDevices[0]) {
								responseObj.updateCount = updatedDevices[0];
								responseObj.updateStatus = 'Device updated';
								res.status(200).json(responseObj);
							} else {
								responseObj.updateStatus = 'IMEI not found';
								res.status(404).json(responseObj);
							}
						})
						.catch(function(err) {
							console.log(err);
							res.status(500).end(err);
						})					
				} else if(req.body.serial_number) {
					Device.update({ rework_config_id: reworkConfigId, rework_date: req.body.reworkDate }, { where: { serial_number: req.body.serial_number } })
						.then(function(updatedDevices) {
							if(updatedDevices[0]) {
								responseObj.updateCount = updatedDevices[0];
								responseObj.updateStatus = 'Device updated';
								res.status(200).json(responseObj);
							} else {
								responseObj.updateStatus = 'Serial Number not found';
								res.status(404).json(responseObj);
							}
						})
						.catch(function(err) {
							console.log(err);
							res.status(500).end(err);
						})
				} else if(req.body.packaging_number) {
					Device.update({ rework_config_id: reworkConfigId, rework_date: req.body.reworkDate }, { where: { packaging_number: req.body.packaging_number } })
						.then(function(updatedDevices) {
							if(updatedDevices[0]) {
								responseObj.updateCount = updatedDevices[0];
								responseObj.updateStatus = 'Device updated';
								res.status(200).json(responseObj);
							} else {
								responseObj.updateStatus = 'Packaging number not found';
								res.status(404).json(responseObj);
							}
						})
						.catch(function(err) {
							console.log(err);
							res.status(500).end(err);
						})
				}
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).end(err);
			})
	})

	// update device with shipment data
	app.patch('/api/device/updateshipment', function(req, res) {
		var responseObj = {};
		if(req.body.imei) {
			Device.update({ so_number: req.body.so_number, shipment_date: req.body.shipment_date }, { where: { imei: req.body.imei } })
				.then(function(updatedDevices) {
					if(updatedDevices[0]) {
						responseObj.updateCount = updatedDevices[0];
						responseObj.updateStatus = 'Shipment details recorded';
						res.status(200).json(responseObj);
					} else {
						responseObj.updateStatus = 'IMEI not found'
						res.status(404).json(responseObj);
					}
				})
				.catch(function(err) {
					console.log(err);
					res.status(500).end(err);
				})			
		} else if(req.body.serial_number) {
			Device.update({ so_number: req.body.so_number, shipment_date: req.body.shipment_date }, { where: { serial_number: req.body.serial_number } })
				.then(function(updatedDevices) {
					if(updatedDevices[0]) {
						responseObj.updateCount = updatedDevices[0];
						responseObj.updateStatus = 'Shipment details recorded';
						res.status(200).json(responseObj);
					} else {
						responseObj.updateStatus = 'Serial Number not found'
						res.status(404).json(responseObj);
					}
				})
				.catch(function(err) {
					console.log(err);
					res.status(500).end(err);
				})
		} else if(req.body.packaging_number) {
			Device.update({ so_number: req.body.so_number, shipment_date: req.body.shipment_date }, { where: { packaging_number: req.body.packaging_number } })
				.then(function(updatedDevices) {
					if(updatedDevices[0]) {
						responseObj.updateCount = updatedDevices[0];
						responseObj.updateStatus = 'Shipment details recorded';
						res.status(200).json(responseObj);
					} else {
						responseObj.updateStatus = 'Packaging number not found';
						res.status(404).json(responseObj);
					}
				})
				.catch(function(err) {
					console.log(err);
					res.status(500).end(err);
				})				
		}
	})

	// list devices by so_number
	app.get('/api/:so_number/devices/index', function(req, res) {
		Device.findAll({ attributes: ['model_name', 'imei', 'serial_number', 'sw_version', 'fw_version', 'shipment_date', 'packaging_number'], include: [ReworkConfig], where: { so_number: req.params.so_number } })
			.then(function(devices) {
				if(devices[0]) {
					res.status(200).json(devices);
					console.log(devices);
				} else {
					res.status(404).end();
				}
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).end(err);
			})
	})

	// update module swap data
	app.patch('/api/device/updatemoduleswap', function(req, res) {
		var responseObj = {};
		Device.update({ model_name: req.body.newDeviceName, imei: req.body.newImei, fw_version: req.body.newFwVersion, module_swapped: 1 }, { where: { imei: req.body.oldImei } })
			.then(function(updatedDevices) {
				if(updatedDevices[0]) {
					responseObj.updateCount = updatedDevices[0];
					responseObj.updateStatus = 'Module swap updated';
					res.status(200).json(responseObj);
				} else {
					responseObj.updateStatus = 'IMEI not found';
					res.status(404).json(responseObj);
				}
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).end(err);
			})
	})
}