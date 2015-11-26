define(function (require) {

	var $ = require("jquery");
	var kudu = require("kudu/kudu");
	var globals = require("app/util/globals");
	var domUtils = require("./util/dom-utils");
	require("./plugins/jquery.placeholder");
	require("./plugins/radios-to-slider");
	require("areYouSure");
	require("bootstrap");
	var Ractive = require("ractive");
	var validationSetup = require("./util/validation-setup");
	//require("./plugins/fullcalendar");
	var home = require("app/views/home/home");
	var subjectSearch = require("app/views/types/subject/subjectSearch");
	var mediumSearch = require("app/views/types/medium/mediumSearch");
	var artistSearch = require("app/views/artist/artistSearch");
	var artistEdit = require("app/views/artist/artistEdit");
	var artSearch = require("app/views/art/artSearch");
	var artEdit = require("app/views/art/artEdit");
	var artTypeSearch = require("app/views/arttype/artTypeSearch");
	var artTypeEdit = require("app/views/arttype/artTypeEdit");
	var propertyTypeSearch = require("app/views/propertytype/propertyTypeSearch");
	var propertyTypeEdit = require("app/views/propertytype/propertyTypeEdit");
	var userSearch = require("app/views/user/userSearch");
	var userEdit = require("app/views/user/userEdit");
	var exhibitionSearch = require("app/views/exhibition/exhibitionSearch");
	var exhibitionEdit = require("app/views/exhibition/exhibitionEdit");
	var notFound = require("app/views/notfound/notFound");
	var router = require("kudu/router/router");
	var helpRegistry = require("./help/help-registry");
	require('app/plugins/ractive-decorators-select2');
	require('app/plugins/ractive-decorators-sortable');
	require('app/plugins/ractive-decorators-are-you-sure');
	require('app/plugins/ractive-decorators-bootstrap-wysiwyg');
	require('app/plugins/ractive-decorators-pagination');
	Ractive.transitions.slide = require('ractive-transitions-slide');
	var toastr = require("app/plugins/toastr");

	var windowResizeId;
	
	
/* TODO New router example code
	var router = {
		'/home': {
			ctrl: home,
			enter: function (view, oldView, ctrl, prevCtrl) {
				view.render("#targetDiv");
				var promise = view.animate("fadeIn");
				return promise;
			},
			leave: function (view, oldView, ctrl, prevCtrl) {
				var promise = view.animate("fadeOut");
				promise.then(function() {
					view.unrender("#targetDiv");
				})
				return promise;
			}
		}
	};*/

	var routes = {
		home: {path: 'home', moduleId: home.id, moo: "pok"},
		artist: {path: 'artist', moduleId: artistSearch.id},
		artistEdit: {path: 'artistEdit', moduleId: artistEdit.id},
		art: {path: 'art', moduleId: artSearch.id},
		artEdit: {path: 'artEdit', moduleId: artEdit.id},
		artType: {path: 'artType', moduleId: artTypeSearch.id},
		artTypeEdit: {path: 'artTypeEdit', moduleId: artTypeEdit.id},
		propertyType: {path: 'propertyType', moduleId: propertyTypeSearch.id},
		propertyTypeEdit: {path: 'propertyTypeEdit/:id', moduleId: propertyTypeEdit.id},
		propertyTypeCreate: {path: 'propertyTypeEdit', moduleId: propertyTypeEdit.id},
		user: {path: 'user', moduleId: userSearch.id},
		userEdit: {path: 'userEdit', moduleId: userEdit.id},
		exhibition: {path: 'exhibition', moduleId: exhibitionSearch.id},
		exhibitionEdit: {path: 'exhibitionEdit', moduleId: exhibitionEdit.id},
		subjectSearch: {path: 'subject', moduleId: subjectSearch.id},
		mediumSearch: {path: 'medium', moduleId: mediumSearch.id},
		notFound: {path: '*', moduleId: notFound.id}
	};

	// Not used but demonstrates how to plugin a custom viewFactory into kudu
	var viewFactory = {
		createView: function (options) {
			var deferred = $.Deferred();
			var promise = deferred.promise();

			options.view = options.viewOrPromise;
			deferred.resolve(options.view);

			return promise;
		},
		renderView: function (options) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			$(options.target).html(options.view);
			deferred.resolve(options.view);
			return promise;
		},
		unrenderView: function (options) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			$(options.target).empty();
			deferred.resolve(options.mvc.view);
			return promise;
		}
	};

	kudu.init({
		target: "#container",
		routes: routes,
		unknownRouteResolver: resolveUnknownRoutes
	});

	Ractive.defaults.debug = true;
	
	/*
	 $(kudu).on('viewBeforeUnrender', function (e, options) {
	 });
	 */

	$(kudu).on('viewUnrender', function (e, options) {
		console.log("viewUnrender", options);
	});
	$(kudu).on('viewRender', function (e, options) {
		console.log("viewRender", options);
	});
	$(kudu).on('viewInit', function (e, options) {
		domUtils.hideErrorDialog();
		//console.log("viewInit", options);
	});
	$(kudu).on('viewBeforeInit', function (e, options) {
		// Remove any listener on the help. The new view should add a listener if it is interested
		$("#help").off('click');
	});
	$(kudu).on('viewComplete', function (e, options) {
		helpRegistry.trigger(artistEdit.id);
		console.log("viewComplete", options);

		// The is complete so we check if the view registered a listener on the Help menu. If not, we add a default handler to say no help is available
		// Note internal jQuery API to find existing click events on the help menu
		var helpEvents = $._data($("#help")[0]).events;
		if (helpEvents && helpEvents.click && helpEvents.click.length > 0) {
		} else {
			$("#help").on('click', function (e) {
				e.preventDefault();
				alert("No help is available at present!");
			});
		}
	});
	/*
	 $(kudu).on('complete', function (e, options) {
	 //console.log("global complete", options);
	 });
	 
	 $(kudu).on('teardown', function (e, options) {
	 //console.log("global teardown", options);
	 });
	 $(kudu).on('render', function (e, options) {
	 console.log("global render", options);
	 });
	 $(kudu).on('complete', function (e, options) {
	 //console.log("global complete", options);
	 });*/
	$(kudu).on('viewFail', function (e, options) {
		domUtils.hideErrorDialog();
		if (options.error == null) {
			console.error("global viewFail", options.newCtrl.id, options);
		} else {
			var error = null;
			if ($.isArray(options.error)) {
				error = options.error[0];
			} else {
				error = options.error;
			}

			var msg = error;

			// Check if it is a real Error thrown
			if (error != null && error.message) {
				msg = error.message;
			}

			if (msg != null && msg.length > 0) {
				//domUtils.showErrorDialog(msg);
				toastr.error(msg, "Error");

				console.error("global viewFail", options.newCtrl.id, msg, options);
			} else {
				console.error("global viewFail", options.newCtrl.id, options.error, options);
			}
			if (error && error.stack) {
				console.log(error.stack);
			}
		}
	});

	function resolveUnknownRoutes() {
		var deferred = $.Deferred();
		var promise = deferred.promise();

		var path = router.urlPath(window.location.href);

		// TODO router.js urlPath only picks up hash if it starts with a '/', but requireJs might want to pick it up under another path?
		//http://localhost:9988/index.html#/js/app/views/home/Home
		//console.log("PATH", path.substr(1));
		//console.log("PATH", path);

		if (path.indexOf("/index.") >= 0) {
			// if no path found in hash, use default module, Home in this example. This code could move to router.js??
			var newRoute = {path: 'home', moduleId: home.id};
			debugger;
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

	var options = {};
	var menuNames = [];
	setupWindowResizeListener();
	setupActiveMenu();
	validationSetup.setupValidation();

	options.defaultView = home;

	function setupActiveMenu() {

		$("#navbar [data-menu]").each(function (i, item) {
			menuNames.push($(item).attr("data-menu"));
		});

		$(kudu).on("viewRender", function (e, options) {
			/*
			 if (!$.fn.placeholder.input || !$.fn.placeholder.textarea) {
			 $('input, textarea').placeholder();
			 }*/

			// Ignore subviews
			if (!options.isMainCtrl) {
				return;
			}

			var routesByPath = kudu.getRoutesByPath();
			var route = routesByPath[options.newCtrl.id];
			if (route == null || route === '*') {
				return;
			}

			// if it is a complex path such as 'customer/:id' we ignore and let the menu cursor stay at it's current position
			var i = route.indexOf('/');
			if (i > 0) {
				route = route.substr(0, i);
			}
			i = route.indexOf('?');
			if (i > 0) {
				route = route.substr(0, i);
			}

			var $item = $("#menu-" + route).parent();

			if ($item.length === 0) {
				// Menu not found on ID, try class
				var $item = $("." + route).parent();

				if ($item.length === 0) {
					// Menu not found. Try and find menu from the list of data-menu attributes
					for (var i = 0; i < menuNames.length; i++) {
						var menuName = menuNames[i];
						// Check if route starts with menu name
						if (route.indexOf(menuName) === 0) {
							$item = $("#navbar [data-menu=" + menuName + "]").parent();
						}
					}
				}
			}
			
			$item = handleDropdown($item);

			var $activeMenu = $("#navbar li.active");
			if ($activeMenu.length > 0) {
				$("#navbar li.active li.sub-active").removeClass("sub-active");
				$("#navbar li.active").removeClass("active");
				slideToActive($item);
			} else {
				setInitialActiveMenu($item);
			}
		});

		$(document).ajaxError(function (e, xhr, settings, exception) {
			//console.log("ajaxError", arguments);
			var message = "";
			if (xhr.status == 0) {
				message = 'You are offline!\n Please check your network.';
			}
			else if (xhr.status == 403) {
				$("<div class='blockview'></div>").appendTo('body');
				domUtils.showErrorDialog("You are not authorized to view this request! Click <a href=''>here</a> to continue.", false);

			} else if (xhr.status == 401) {
				$("<div class='blockview'></div>").appendTo('body');
				domUtils.showErrorDialog("Your session have timed out! Click <a href=''>here</a> to login again.", false);

			} else if (xhr.status == 404) {
				message = 'Requested URL not found.';
			}
			console.log("AjaxError", message);
		});

		$(kudu).on("ajax.success", function (e, options) {
			//console.log("ajax.success", options);
		});
		$(kudu).on("ajax.error", function () {
			//console.log("ajax.error", arguments);
		});
		$(kudu).on("ajax.complete", function (e, options) {
			//console.log("ajax.complete", options);
		});

		$(kudu).on("ajax.start", function (e, options) {
			//console.error("local start", options.args);
		});

		$(kudu).on("ajax.stop", function (e, options) {
			//console.error("local stop", options.args);
		});

		$(kudu).on("global.ajax.start", function (e, options) {
			//console.error("global start", options.args);
			var msg = "Loading...";
			options = options || {};
			options.args = options.args || {};
			if (options.args.msg != null) {
				msg = options.args.msg;
			}

			domUtils.showLoadingDialog(msg);
		});
		$(kudu).on("global.ajax.stop", function (e, options) {
			//console.error("global stop", options.args);
			domUtils.hideLoadingDialog();
		});
	}

	/*
	 function setActiveMenu(view) {
	 if (view == null) {
	 return;
	 }
	 var routesByPath = viewManager.getRoutesByPath();
	 var route = routesByPath[view.id];
	 $("#navbar li.active").removeClass("active");
	 if (route == null) {
	 return;
	 }
	 var item = $("#menu-" + route).parent();
	 var location = getActiveMenuLocation(item);
	 item.addClass("active");
	 $("#nav-ind").css(location);
	 }*/

	function handleDropdown($item) {
		if ($item.length === 1) {

			// If this menu is in a dropdown, we need to reference the top parent menu item to highlight it
			var $dropdown = $item.closest('.dropdown');

			if ($dropdown.length === 1) {
				$item.addClass("sub-active");

				// store reference to $item 
				$dropdown.child = $item;
				$item = $dropdown;
			}
		}

		return $item;
	}

	function setInitialActiveMenu(itemOrName) {
		var $item = itemOrName;
		if (typeof itemOrName === "string") {
			$item = $("#menu-" + itemOrName).parent();
		}
		$item.addClass('active');
		var location = getActiveMenuLocation($item);
		$('#nav-ind').css(location);
	}

	function slideToActive($li) {
		$li.addClass('active');

		// If this menu is in a dropdown, we need to reference the top parent menu item to highlight it
		if ($li.child) {
			$li.child.addClass("sub-active");
		}


		if ($("#nav-ind").is(":visible")) {
			// Only navigate to the menu if the menu has not collapsed yet ie is less than 768px
			var location = getActiveMenuLocation($li);
			$('#nav-ind').animate(location, 'fast', 'linear');
		}
	}

	function setupWindowResizeListener() {
		$(window).resize(function () {
			clearTimeout(windowResizeId);
			windowResizeId = setTimeout(windowResized, 0);
		});

		windowResized();
	}

	function windowResized() {
		if (window.matchMedia('(min-width: 768px)').matches) {
			var $activeMenu = $("#navbar li.active");
			if ($activeMenu.length > 0) {
				var location = getActiveMenuLocation($activeMenu);
				$('#nav-ind').css(location);
			}
		}
	}

	function getActiveMenuLocation($li) {
		var offsetTop = 50;
		var $item = $($li);
		var offsetLeft = 0;
		if ($item.length) {
			var offsetLeft = $item.offset().left - $('#navbar').offset().left;
		}
		var location = {
			top: offsetTop,
			left: offsetLeft,
			right: $('#navbar').width() - $($li).width() - offsetLeft,
			bottom: $('#navbar').height() - $($li).height() - offsetTop
		};
		return location;
	}
});