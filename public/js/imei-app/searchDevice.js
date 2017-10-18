var searchDevice = new Vue({
	el: '#searchDevice',
	data: {
		searchQuery: '',
		searchError: null,
		deviceInfo: null,
		reworkConfig: null
	},
	methods: {
		searchDevice: function() {
			this.$http.get('/api/device/' + this.searchQuery)
				.then(function(res) {
					this.$set(this, 'deviceInfo', res.data.deviceInfo);
					this.$set(this, 'reworkConfig', res.data.reworkConfig);
				})
				.catch(function(err) {
					this.$set(this, 'deviceInfo', null);
					this.$set(this, 'reworkConfig', null);
					this.$set(this, 'searchError', err.status);
				})
		},
		parseDate: function(date) {
			return moment(date).format('DD MMM YYYY')
		}
	}
})