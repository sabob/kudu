define(function (require) {
	var $ = require("jquery");
	var template = require("rvc!./notFound");

	function notFound() {
		
		var that = this;

		that.onInit = function (options) {
			
			var view = createView();
			return new view();
		};

		function createView() {
			return template;
		}

		return that;
	}
	return notFound;
});
