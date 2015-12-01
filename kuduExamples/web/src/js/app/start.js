define(function (require) {
	var $ = require("jquery");
	var routes = require("app/config/routes");

	var kudu = require("kudu");

	kudu.router().addRoute({path: "/moo", moduleId: "one"});

	kudu.init({
		target: "#container",
		routes: routes,
		defaultRoute: routes.home
				//unknownRouteResolver: null,
				//fx: true
	});

	/*  Below we are manually navigating the menus instead of using the href tag. The advantage of this is clicking on the link will force
	 * a page reload, while using the href tag on the second click won't, since the hash value does not change. */
	/*
	 $("#menu-home").on('click', function (e) {
	 e.preventDefault();
	 kudu.route({ctrl: home});
	 });*/

});