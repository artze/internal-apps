var headerNav = new Vue({
	el: '#headerNav',
	data: {
		activeLink: ''
	},
	mounted: function() {
		var currentPathname = window.location.pathname;
		this.$set(this, 'activeLink', currentPathname);
	},
	methods: {
		checkActiveLink: function(pathname) {
			return this.activeLink === pathname;
		}
	}
})