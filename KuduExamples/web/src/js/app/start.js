define(function (require) {
	var $ = require("jquery");
	var router = require("kudu/router/router");
	var routes = require("app/config/routes");
	require("app/config/disableDragging");

	var kudu = require("kudu/kudu");

	kudu.init({
		target: "#container",
		routes: routes,
		//unknownRouteResolver: resolveUnknownRoutes,
		defaultRoute: routes.home
		
		//transitionsEnabled: true
	});

	
	/*  Below we are manually navigating the menus instead of using the href tag. The advantage of this is clicking on the link will force
	 * a page reload, while using the href tag on the second click won't, since the hash value does not change. */

	$("#menu-home").on('click', function (e) {
		e.preventDefault();
		kudu.route({ctrl: home});
	});

});