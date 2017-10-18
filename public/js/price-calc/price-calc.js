var priceCalc = new Vue({
	el: '#price-calc',
	data: {
		productName: '',
		productInfo: '',
		selectedQty: '',
		price: '',
		// product TypeAhead variables
		productList: [],
		productSuggestionsMenu: false,
		selectedProductSuggestionIndex: 0,
		// product TypeAhead variables end
		errorMsg: ''
	},
	mounted: function() {
		this.getProductList();
	},
	computed: {
		// product name TypeAhead
		searchProductMatches: function() {
			var searchQuery = this.productName.toUpperCase();
			return this.productList.filter(function(value) {
				return value.indexOf(searchQuery) >= 0;
			})
		},
		toggleProductSuggestionsMenu: function() {
			return this.productName.length !== 0 && this.searchProductMatches.length !== 0 && this.productSuggestionsMenu === true;
		},
		// product name TypeAhead end
		roundedPrice: function() {
			var lastDigit = parseInt((Math.round(this.price * 100) / 100).toFixed(2).toString().split('').pop())
			if(lastDigit === 1 || lastDigit === 2 || lastDigit === 6 || lastDigit === 7) {
				return (Math.floor(this.price * 20)/20).toFixed(2);
			} else {
				return (Math.ceil(this.price * 20)/20).toFixed(2);
			}
		}
	},
	methods: {
		getProductList: function() {
			this.$http.get('/price-calc/api/product/index')
				.then(function(res){
					this.productList = res.data;
				})
				.catch(function(res) {
					console.log(res.data);
				})
		},
		// product name TypeAhead
		productNameInputChange: function() {
			this.selectedProductSuggestionIndex = 0;
			if(this.productName.length !== 0 && this.searchProductMatches.length !== 0) {
				this.productSuggestionsMenu = true;
			} else {
				this.productSuggestionsMenu = false;
			}
		},
		activeProductSuggestion: function(index) {
			return this.selectedProductSuggestionIndex === index;
		},
		productDownKey: function() {
			if(this.selectedProductSuggestionIndex < this.searchProductMatches.length - 1) {
				this.selectedProductSuggestionIndex++;
			}
		},
		productUpKey: function() {
			if(this.selectedProductSuggestionIndex > 0) {
				this.selectedProductSuggestionIndex--;
			}
		},
		productHoverSuggestion: function(index) {
			this.selectedProductSuggestionIndex = index;
		},
		productEnterSuggestion: function() {
			this.resetFields();
			if(this.productName.length === 0) {
				this.errorMsg = 'Please enter a product';
			} else if(this.productSuggestionsMenu === false) {
				this.errorMsg = 'Product does not exist';
			} else {
				this.productName = this.searchProductMatches[this.selectedProductSuggestionIndex];
				this.productSuggestionsMenu = false;
				this.getProductInfo();
			}
		},
		productClickSuggestion: function(index) {
			this.resetFields();
			this.selectedProductSuggestionIndex = index;
			this.productName = this.searchProductMatches[this.selectedProductSuggestionIndex];
			this.productSuggestionsMenu = false;
			this.getProductInfo();
		},
		// product name TypeAhead end
		getProductInfo: function() {
			this.$http.get('/price-calc/api/product/show/' + encodeURIComponent(this.productName))
				.then(function(res) {
					this.productInfo = res.data;
				})
				.catch(function(res) {
					console.log(res.data);
				})
		},
		getProductPrice: function() {
			this.price = this.productInfo.cogs + ( (this.productInfo.selling_price - this.productInfo.cogs) * Math.pow(this.selectedQty, (Math.log(1 + this.productInfo.slope) / Math.log(2))) / parseInt(this.selectedQty));
			this.price = this.price / (1 - this.productInfo.mpd);
		},
		resetFields: function() {
			this.errorMsg = '';
			this.productInfo = '';
			this.price = '';
			this.selectedQty = '';
		}
	}
})