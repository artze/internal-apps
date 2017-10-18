var rework = new Vue({
	el: '#rework',
	data: {
		config: {script: '', sw_version: '', fw_version: '', notes: ''},
		createStatus: '',
		scriptNames: [],
		scriptSuggestionsMenu: false,
		selectedScriptSuggestionIndex: 0,
		imeiInput: '',
		serial_numberInput: '',
		packaging_numberInput: '',
		deviceConfig: {script: '', reworkDate: '', imei: '', serial_number: '', packaging_number: ''},
		reworkSubmitStatus: '',
		updateCounter: 0,
		scriptShowConfig: {script: '', sw_version: '', fw_version: '', notes: ''},
		scriptShowStatus: '',
		deviceNames: ['E220#NC', 'E224#38K##38', 'E224#4D', 'E224#24C', 'E224#358S#158', 'E225#02', 'E225', 'E228#4D', 'E228#245H', 'E228#245DH#25', 'E228#37S', 'E228#1JL', 'E228#1BI', 'E228#1357'],
		deviceSuggestionsMenu: false,
		selectedDeviceSuggestionIndex: 0,		
		newImeiInput: '',
		newDeviceName: '',
		newFwVersion: '',
		updateModuleSwapStatus: '',
		updateModuleSwapCounter: 0
	},
	mounted: function() {
		this.getScriptNames();
		var reworkDeviceInstance = this;
		$('.input-group.date').datepicker({
	    format: 'dd M yyyy',
	    autoclose: true,
	    todayHighlight: true,
	    orientation: 'bottom',
	    todayBtn: 'linked'
		})
			.on('changeDate', function() {
				var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				var monthNumber = ('0' + (month.indexOf($('#reworkDate').val().slice(3, 6)) + 1)).slice(-2);
				var reworkDateSqlFormat = $('#reworkDate').val().slice(7, 11) + '-' + monthNumber + '-' + $('#reworkDate').val().slice(0, 2)
				reworkDeviceInstance.deviceConfig.reworkDate = reworkDateSqlFormat;
			});
	},
	computed: {
		// script name TypeAhead 
		searchScriptMatches: function() {
			var searchQuery = this.deviceConfig.script.toLowerCase();
			return this.scriptNames.filter(function(value) {
				var scriptNameLowerCase = value.toLowerCase();
				return scriptNameLowerCase.indexOf(searchQuery) >= 0;
			})
		},
		toggleScriptSuggestionsMenu: function() {
			return this.deviceConfig.script.length !== 0 && this.searchScriptMatches.length !== 0 && this.scriptSuggestionsMenu === true;
		},
		// script name TypeAhead End

		// device name TypeAhead
		searchDeviceMatches: function() {
			var searchQuery = this.newDeviceName.toLowerCase();
			return this.deviceNames.filter(function(value) {
				var deviceNameLowerCase = value.toLowerCase();
				return deviceNameLowerCase.indexOf(searchQuery) >= 0;
			})
		},
		toggleDeviceSuggestionsMenu: function() {
			return this.newDeviceName.length !== 0 && this.searchDeviceMatches.length !== 0 && this.deviceSuggestionsMenu === true;
		}

		// device name TypeAhead End
	},
	methods: {
		createConfig: function() {
			if(this.config.script === '' || this.config.sw_version === '' || this.config.fw_version === '') {
				this.createStatus = 'Required fields cannot be blank'
			} else {	
				this.$http.post('/api/reworkconfig/create', this.config)
					.then(function(res) {
						this.createStatus = res.data;
						this.config = {script: '', sw_version: '', fw_version: '', notes: ''};
						this.getScriptNames();
					})
					.catch(function(res) {
						this.createStatus = res.data
					})
			}
		},
		getScriptNames: function() {
			this.$http.get('/api/reworkconfig/index')
				.then(function(res) {
					this.$set(this, 'scriptNames', res.data)
				})
				.catch(function(res) {
					console.log(res.data)
				})
		},
		getScriptConfig: function() {
			this.scriptEnterSuggestion();
			this.scriptShowStatus = '';
			this.scriptShowConfig = {script: '', sw_version: '', fw_version: '', notes: ''};
			if(!this.deviceConfig.script) {
				this.$set(this, 'scriptShowStatus', 'Script name cannot be empty');
			} else if(this.scriptNames.indexOf(this.deviceConfig.script) < 0) {
				this.$set(this, 'scriptShowStatus', 'Script name does not exist');				
			} else {
				this.$http.get('/api/reworkconfig/show/' + encodeURIComponent(this.deviceConfig.script))
					.then(function(res) {
						this.scriptShowConfig.script = res.data.script;
						this.scriptShowConfig.sw_version = res.data.sw_version;
						this.scriptShowConfig.fw_version = res.data.fw_version;
						this.scriptShowConfig.notes = res.data.notes;
					})
					.catch(function(err) {
						console.log(err);
					})
			}
		},
		// script name TypeAhead
		scriptInputChange: function() {
			this.selectedScriptSuggestionIndex = 0;
			if(this.deviceConfig.script.length !== 0 && this.searchScriptMatches.length !== 0) {
				this.scriptSuggestionsMenu = true;
			} else {
				this.scriptSuggestionsMenu = false;
			}
		},
		activeScriptSuggestion: function(index) {
			return this.selectedScriptSuggestionIndex === index;
		},
		scriptDownKey: function() {
			if(this.selectedScriptSuggestionIndex < this.searchScriptMatches.length - 1) {
				this.selectedScriptSuggestionIndex++;				
			}
		},
		scriptUpKey: function() {
			if(this.selectedScriptSuggestionIndex > 0) {
				this.selectedScriptSuggestionIndex--;
			}
		},
		scriptHoverSuggestion: function(index) {
			this.selectedScriptSuggestionIndex = index;
		},
		scriptEnterSuggestion: function() {
			if(this.deviceConfig.script.length === 0 || this.scriptSuggestionsMenu === false) {
				return;
			}
			this.deviceConfig.script = this.searchScriptMatches[this.selectedScriptSuggestionIndex];
			this.scriptSuggestionsMenu = false;			
		},
		scriptClickSuggestion: function(index) {
			this.selectedScriptSuggestionIndex = index;
			this.deviceConfig.script = this.searchScriptMatches[this.selectedScriptSuggestionIndex];
			this.scriptSuggestionsMenu = false;
		},
		// script name TypeAhead End

		resetCounter: function() {
			this.updateCounter = 0;
			this.reworkSubmitStatus = '';
		},
		imeiValidation: function(imei) {
			return /[0-9]{15}/.test(imei);
		},
		serial_numberValidation: function(serial_number) {
			return /[0-9]{14}/.test(serial_number);
		},
		submitRework: function() {

			var inputParameter = this.imeiInput || this.serial_numberInput || this.packaging_numberInput;
			inputParameter = inputParameter.split(' ');

			if(!this.deviceConfig.script) {
				// script name fails non-empty validation
				this.$set(this, 'reworkSubmitStatus', 'Script name cannot be empty');
				this.imeiInput = '';
				this.serial_numberInput = '';
				this.packaging_numberInput = '';
			} else if(this.scriptNames.indexOf(this.deviceConfig.script) < 0) {
				// script name fails does-not-exist validation
				this.$set(this, 'reworkSubmitStatus', 'Script name does not exist');
				this.imeiInput = '';
				this.serial_numberInput = '';
				this.packaging_numberInput = '';
			} else if(!this.deviceConfig.reworkDate) {
				// rework date fails non-empty validation
				this.$set(this, 'reworkSubmitStatus', 'Please enter rework date');
				this.imeiInput = '';
				this.serial_numberInput = '';
				this.packaging_numberInput = '';				
			} else if(this.imeiInput && !inputParameter.every(this.imeiValidation)) {
				// imei fails validation
				this.$set(this, 'reworkSubmitStatus', 'IMEI must contain 15 digits');
				this.imeiInput = '';
			} else if(this.serial_numberInput && !inputParameter.every(this.serial_numberValidation)) {
				// serial_number fails validation			
				this.$set(this, 'reworkSubmitStatus', 'Serial number must contain 14 digits');
				this.serial_numberInput = '';
			} else {
				for(var i = 0; i < inputParameter.length; i++) {
					if(this.imeiInput) {
						this.deviceConfig.imei = inputParameter[i];
					} else if(this.serial_numberInput) {
						this.deviceConfig.serial_number = inputParameter[i];
					} else if(this.packaging_numberInput) {
						this.deviceConfig.packaging_number = inputParameter[i];
					}
					this.$http.patch('/api/device/updaterework', this.deviceConfig)
						.then(function(res) {
							this.reworkSubmitStatus = res.data.updateStatus;
							this.updateCounter += res.data.updateCount;
							this.imeiInput = '';
							this.serial_numberInput = '';
							this.packaging_numberInput = '';
						})
						.catch(function(res) {
							this.reworkSubmitStatus = res.data.updateStatus;
							this.imeiInput = '';
							this.serial_numberInput = '';
							this.packaging_numberInput = '';
						})
				}
			}
		},

		// device name TypeAhead
		deviceInputChange: function() {
			this.selectedDeviceSuggestionIndex = 0;
			if(this.newDeviceName.length !== 0 && this.searchDeviceMatches.length !== 0) {
				this.deviceSuggestionsMenu = true;
			} else {
				this.deviceSuggestionsMenu = false;
			}
		},
		activeDeviceSuggestion: function(index) {
			return this.selectedDeviceSuggestionIndex === index;
		},
		deviceDownKey: function() {
			if(this.selectedDeviceSuggestionIndex < this.searchDeviceMatches.length - 1) {
				this.selectedDeviceSuggestionIndex++;				
			}
		},
		deviceUpKey: function() {
			if(this.selectedDeviceSuggestionIndex > 0) {
				this.selectedDeviceSuggestionIndex--;
			}
		},
		deviceHoverSuggestion: function(index) {
			this.selectedDeviceSuggestionIndex = index;
		},
		deviceEnterSuggestion: function() {
			if(this.newDeviceName.length === 0 || this.deviceSuggestionsMenu === false) {
				return;
			}
			this.newDeviceName = this.searchDeviceMatches[this.selectedDeviceSuggestionIndex];
			this.deviceSuggestionsMenu = false;			
		},
		deviceClickSuggestion: function(index) {
			this.selectedDeviceSuggestionIndex = index;
			this.newDeviceName = this.searchDeviceMatches[this.selectedDeviceSuggestionIndex];
			this.deviceSuggestionsMenu = false;
		},
		// device name TypeAhead End
		resetModuleSwapCounter: function() {
			this.updateModuleSwapCounter = 0;
			this.updateModuleSwapStatus = '';
		},
		updateModuleSwap: function() {
			var imeiInputArr = this.imeiInput.split(' ');
			var newImeiInputArr = this.newImeiInput.split(' ');
			if(!this.imeiInput || !this.newDeviceName || !this.newFwVersion) {
				this.$set(this, 'updateModuleSwapStatus', 'Fields cannot be blank');
			} else if(!imeiInputArr.every(this.imeiValidation) || (!newImeiInputArr.every(this.imeiValidation) && this.newImeiInput)) {
				this.$set(this, 'updateModuleSwapStatus', 'IMEI must contain 15 digits');
				this.imeiInput = '';
				this.newImeiInput = '';
			} else if(this.deviceNames.indexOf(this.newDeviceName) < 0) {
				this.$set(this, 'updateModuleSwapStatus', 'Device name does not exist');
				this.newDeviceName = '';
			} else if(!(imeiInputArr.length === newImeiInputArr.length) && this.newImeiInput) {
				this.$set(this, 'updateModuleSwapStatus', `There ${imeiInputArr.length === 1 ? 'is' : 'are' } ${imeiInputArr.length} old IMEI and ${newImeiInputArr.length} new IMEI`);
				this.imeiInput = '';
				this.newImeiInput = '';				
			} else {
				for(var i = 0; i < imeiInputArr.length; i++) {
					var moduleSwapObj = {
						oldImei: imeiInputArr[i],
						newImei: newImeiInputArr[i] ? newImeiInputArr[i] : null,
						newDeviceName: this.newDeviceName,
						newFwVersion: this.newFwVersion
					}
					console.log(moduleSwapObj)
					this.$http.patch('/api/device/updatemoduleswap', moduleSwapObj)
						.then(function(res) {
							this.updateModuleSwapStatus = res.data.updateStatus;
							this.updateModuleSwapCounter += res.data.updateCount;
							this.imeiInput = '';
							this.newImeiInput = '';
							this.newDeviceName = '';
							this.newFwVersion = '';
						})
						.catch(function(res) {
							this.updateModuleSwapStatus = res.data.updateStatus;
							this.imeiInput = '';
							this.newImeiInput = '';
							this.newDeviceName = '';
							this.newFwVersion = '';							
						})
				}
			}
		}
	}
})