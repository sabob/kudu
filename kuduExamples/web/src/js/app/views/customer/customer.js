define(function (require) {
	var $ = require("jquery");
	var kudu = require("kudu");
	var template = require("rvc!./customer");

	function customer() {

		var that = {};

		that.onInit = function (options) {

			var view = createView();
			return view;
		};

		function createView() {

			var view = new template({
				home: function () {
					var e = this.event;
					e.original.preventDefault();
					require(["../home/home"], function (home) {
						kudu.route({ctrl: home});
					});
				}
			});
			return view;
		}

		return that;
	}
	return customer;
});
