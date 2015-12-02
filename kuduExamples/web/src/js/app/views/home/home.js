define(function (require) {
	var $ = require("jquery");
	var kudu = require("kudu");
	var customer = require("../customer/customer");
	var template = require("rvc!./home");

	function home() {

		var that = {};

		that.onInit = function (options) {
			var view = createView();
			return view;
		};

		function createView() {

			var view = new template({
				addCustomer: function () {
					var e = this.event;
					e.original.preventDefault();
					kudu.route({ctrl: customer});
				}
			});
			return view;
		}

		return that;
	}
	return home;
});
