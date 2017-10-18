var uploadCSV = new Vue({
	el: '#uploadCSV',
	data: {
		uploadFileName: '',
		uploadStatus: '',
		uploadStatusMessage: '',
		errorMessage: '',
		uploadSuccess: false,
		progressBar: false
	},
	watch: {
		uploadStatus: function() {
			if(this.uploadStatus == 'Upload Successful') {
				this.$set(this, 'uploadSuccess', true);
				this.$set(this, 'uploadStatusMessage', `${this.uploadFileName} uploaded successfully at ${new Date()}`);
				this.$set(this, 'progressBar', false)
				this.$set(this, 'uploadStatus', '');
			} else if(this.uploadStatus == 'Upload Error') {
				this.$set(this, 'uploadSuccess', false);
				this.$set(this, 'uploadStatusMessage', `${this.uploadFileName} failed to upload at ${new Date()}`);
				this.$set(this, 'progressBar', false)				
				this.$set(this, 'uploadStatus', '');
			} else if(this.uploadStatus == 'No File Chosen') {
				this.$set(this, 'uploadSuccess', false);
				this.$set(this, 'uploadStatusMessage', 'Please select a file!');
				this.$set(this, 'progressBar', false);
				this.$set(this, 'uploadStatus', '');
			} else if(this.uploadStatus == 'Wrong File Type') {
				this.$set(this, 'uploadSuccess', false);
				this.$set(this, 'uploadStatusMessage', 'Only CSV files allowed!');
				this.$set(this, 'progressBar', false);
				this.$set(this, 'uploadStatus', '');				
			}
		}
	},
	methods: {
		uploadFile: function() {
			var form = document.forms.namedItem('fileUploadForm');
			var formData = new FormData(form);
			if(this.uploadStatusMessage) {
				this.uploadStatusMessage = '';
			}
			if(!this.uploadFileName) {
				return this.uploadStatus = 'No File Chosen';
			}
			this.$set(this, 'progressBar', true);
			this.$http.post('/price-calc/api/upload', formData)
				.then(function(res) {
					this.$set(this, 'uploadStatus', res.data.uploadStatus);
				})
				.catch(function(res) {
					this.$set(this, 'uploadStatus', res.data.uploadStatus);
					this.$set(this, 'errorMessage', res.data.errorMessage);
				})
		},
		fileInputChange: function(event) {
			var fileName = event.target.files[0].name
			this.$set(this, 'uploadFileName', fileName);
		}
	}
})