define(function (require) {

	var Ractive = require("ractive");
	var home = require("app/views/home/home");
	var customer = require("app/views/customer/customer");
	var notFound = require("app/views/notfound/notFound");

	function routes() {

		var homeRoute = {path: '/home',
			ctrl: home
		};

		var routes = {
			home: homeRoute,
			customer: {path: '/customer', ctrl: customer},
			notFound: {path: '*', ctrl: notFound}
		};

		Ractive.defaults.debug = true;
		
		return routes;

	}
	return routes();
});