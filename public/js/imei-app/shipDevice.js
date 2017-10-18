var shipment = new Vue({
	el: '#shipment',
	data: {
		imeiInput: '',
		serial_numberInput: '',
		packaging_numberInput: '',
		shipment: {so_number: '', shipment_date: '', imei: '', serial_number: '', packaging_number: ''},
		shipmentUpdateStatus: '',
		updateCounter: 0,
		so_numberQuery: '',
		devicesList: '',
		listDevicesStatus: ''
	},
	mounted: function() {
		var createShipmentInstance = this;
		$('.input-group.date').datepicker({
			format: 'dd M yyyy',
			autoclose: true,
			todayHighlight: true,
			orientation: 'bottom',
			todayBtn: 'linked'
		})
			.on('changeDate', function() {
				var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				var monthNumber = ('0' + (month.indexOf($('#shipmentDate').val().slice(3, 6)) + 1)).slice(-2);
				var shipmentDateSqlFormat = $('#shipmentDate').val().slice(7, 11) + '-' + monthNumber + '-' + $('#shipmentDate').val().slice(0, 2)
				createShipmentInstance.shipment.shipment_date = shipmentDateSqlFormat;
			})
	},
	methods: {
		updateShipment: function() {
			var inputParameter = this.imeiInput || this.serial_numberInput || this.packaging_numberInput;
			inputParameter = inputParameter.split(' ');
			var so_numberValidatation = /S\dNO-\d{10}/.test(this.shipment.so_number)
			function imeiValidation(imei) {
				return /[0-9]{15}/.test(imei);
			}

			function serial_numberValidation(serial_number) {
				return /[0-9]{14}/.test(serial_number);
			}			
			if(!so_numberValidatation) {
				this.shipmentUpdateStatus = 'SO number format is invalid';
				this.imeiInput = '';
				this.serial_numberInput = '';
				this.packaging_numberInput = '';
				this.shipment.imei = '';
				this.shipment.serial_number = '';
				this.shipment.packaging_number = '';
			} else if(!this.shipment.shipment_date) {
				this.shipmentUpdateStatus = 'Please enter shipment date';
				this.imeiInput = '';
				this.serial_numberInput = '';
				this.packaging_numberInput = '';
				this.shipment.imei = '';
				this.shipment.serial_number = '';
				this.shipment.packaging_number = '';
			} else if(this.imeiInput && !inputParameter.every(imeiValidation)) {
				this.shipmentUpdateStatus = 'IMEI must contain 15 digits';
				this.imeiInput = '';
				this.shipment.imei = '';
				this.shipment.serial_number = '';
				this.shipment.packaging_number = '';
			} else if(this.serial_numberInput && !inputParameter.every(serial_numberValidation)) {
				this.shipmentUpdateStatus = 'Serial number must contain 14 digits';
				this.serial_numberInput = '';
				this.shipment.imei = '';
				this.shipment.serial_number = '';
				this.shipment.packaging_number = '';
			}	else {
				for(var i = 0; i < inputParameter.length; i++) {
					if(this.imeiInput) {
						this.shipment.imei = inputParameter[i];
					} else if(this.serial_numberInput) {
						this.shipment.serial_number = inputParameter[i];
					} else if(this.packaging_numberInput) {
						this.shipment.packaging_number = inputParameter[i];
					}
					this.$http.patch('/api/device/updateshipment', this.shipment)
						.then(function(res) {
							this.shipmentUpdateStatus = res.data.updateStatus;
							this.updateCounter += res.data.updateCount;
							this.imeiInput = '';
							this.serial_numberInput = '';
							this.packaging_numberInput = '';
							this.shipment.imei = '';
							this.shipment.serial_number = '';
							this.shipment.packaging_number = '';							
						})
						.catch(function(res) {
							this.shipmentUpdateStatus = res.data.updateStatus;
							this.imeiInput = '';
							this.serial_numberInput = '';
							this.packaging_numberInput = '';
							this.shipment.imei = '';
							this.shipment.serial_number = '';
							this.shipment.packaging_number = '';							
						})
				}
			}
		},
		resetCounter: function() {
			this.updateCounter = 0;
			this.shipmentUpdateStatus = '';
		},
		listDevices: function() {
			this.devicesList = '';
			this.listDevicesStatus = '';
			this.$http.get('/api/' + this.so_numberQuery + '/devices/index')
				.then(function(res) {
					this.devicesList = res.data;
				})
				.catch(function(res) {
					this.listDevicesStatus = res.status;
				})
		},
		parseDate: function(date) {
			return moment(date).format('DD MMM YYYY')
		}		
	}
})