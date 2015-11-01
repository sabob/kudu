define(function (require) {
	var $ = require("jquery");
	var kudu = require("kudu/kudu");
	//require('ractive-transitions-fade');
	var template = require("rvc!./home");
	
	function home() {

		var that = {};

		that.onInit = function (options) {
			setupHelp();
			console.log("ON INIT", options);

			var view = createView();
			return view;
		};

		that.onRemove = function (options) {
			console.log("ON_REMOVE called", options);
			var def = $.Deferred();
			def.resolve();

			return def.promise();
		};

		that.onComplete = function (options) {
			console.log("HOME ON_COMPLETE called", options);
		};

		function createView() {

			var view = new template({

				addArt: function () {
					var e = this.event;
					e.original.preventDefault();
					kudu.route({ctrl: artEdit});
				},
				editArt: function () {
					var e = this.event;
					e.original.preventDefault();
					kudu.route({ctrl: artSearch});
				},
				addArtist: function () {
					var e = this.event;
					e.original.preventDefault();
					kudu.route({ctrl: artistEdit});
				},
				editArtist: function () {
					var e = this.event;
					e.original.preventDefault();
					kudu.route({ctrl: artistSearch});
				}
			});
			return view;
		}

		that.onUnrender = function (options) {
			console.log("HOME ON_UNRENDER called", options);
		};

		that.onRender = function (options) {
			console.log("HOME ON_RENDER called", options);
		};

		function setupHelp() {

			// Switch off any other click handler present on help
			$("#help").on('click', function (e) {
				e.preventDefault();
				domUtils.showLoadingDialog("Loading...help is on it's way!");

				// NOTE: to conditionally include a module one MUST load asynchronously  by using the array notation require(["./util/help"]) shown below				
				require(["app/help/home/help"], function (help) {
					help();
				});
				// If one loads the module synchronously (without array notation eg: require("./util/help") the module loads upfront, not lazily!
				// In short synchronous conditional module loading is not possible!
				//require("./util/help");
			});
		}

		return that;
	}
	return home;
});
