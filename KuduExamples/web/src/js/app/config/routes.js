define(function (require) {

	var $ = require("jquery");
	var kudu = require("kudu/kudu");
	var router = require("kudu/router/router");
	var Ractive = require("ractive");
	var home = require("app/views/home/home");
	var notFound = require("app/views/notfound/notFound");

	function routes() {

		var routes = {
			home: {path: 'home', moduleId: home.id},
			notFound: {path: '*', moduleId: notFound.id}
		};

		kudu.init({
			target: "#container",
			routes: routes,
			unknownRouteResolver: resolveUnknownRoutes
		});

		function resolveUnknownRoutes() {
			var deferred = $.Deferred();
			var promise = deferred.promise();

			var path = router.urlPath(window.location.href);

			// TODO router.js urlPath only picks up hash if it starts with a '/', but requireJs might want to pick it up under another path?
			//http://localhost:9988/index.html#/js/app/views/home/Home
			//console.log("PATH", path.substr(1));
			//console.log("PATH", path);
			
			if (path.indexOf("/index.") >= 0 || path.endsWith("/")) {
				// if no path found in hash, use default module, Home in this example. This code could move to router.js??
				var newRoute = {path: 'home', moduleId: home.id};
				deferred.resolve(newRoute);
				return promise;
			}

			if (path.indexOf("/") === 0) {
				path = path.substr(1);
			}

			require([path], function (module) {
				var newRoute = {
					path: path,
					moduleId: path
				};
				deferred.resolve(newRoute);

			}, function () {
				deferred.reject();

			});

			return promise;
		}

		Ractive.defaults.debug = true;

	}
	return routes();
});