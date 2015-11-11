define(function (require) {

	var $ = require("jquery");
	var kudu = require("kudu/kudu");
	var router = require("kudu/router/router");
	var Ractive = require("ractive");
	var home = require("app/views/home/home");
	var customer = require("app/views/customer/customer");
	var notFound = require("app/views/notfound/notFound");

	function routes() {

		var homeRoute = {path: 'home',
			ctrl: home,
			enter: function (options) {
				var deferred = $.Deferred();
				var promise = deferred.promise();
				options.view.render(options.target);
				//$(args.target).show();
//				$(args.target).fadeIn(1000, function () {
//					deferred.resolve();
//				});
				//return promise;
			},
			leave: function (options) {
				var deferred = $.Deferred();
				var promise = deferred.promise();
				options.prevView.unrender(options.target);
//				$(args.target).fadeOut(1000, function () {
//					args.prevView.unrender(args.target);
//					deferred.resolve();
//				});
				//return promise;
			}
		};

		var routes = {
			home: homeRoute,
			customer: {path: '/customer', moduleId: customer.id},
			notFound: {path: '*', moduleId: notFound.id}
		};

		Ractive.defaults.debug = true;
		
		return routes;

	}
	return routes();
});