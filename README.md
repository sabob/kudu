# Welcome to Kudu

Kudu is a micro MVC framework centered around AMD modules and Ractive templates.

kudu provides a router for mapping URLs to controllers. Controllers are essentially AMD modules with a well defined life-cycle consisting
of an "initialization" phase, "rendering" phase and finally a "remove" phase. AMD modules can partake in these phases by implementing the
appropriate method such as "onInit", "onRender", "onRemove" etc.

Each controller has an associated View and Model. The View is a Ractive instance that binds to the Model. The Model is a plain javascript
object generally fetched as data from the server.

Setup
-----

Create a web project with the following structure:

```
web
    src
        index.jsp
        css
        js
            app
            lib
                require.js
                ractive.js
                kudu
                    kudu files
            config.js
```

Kudu
----

The kudu module is a facade for the framework and most interaction with the framework is handled by the kudu module.

There is one kudu instance per application.

A new kudu instance is initialized by passing in a "target", an element ID where views will be rendered, and a "routes" object 
which specifies which URLs map to which Controllers.

Here is an example setup.js file showing how to setup and create a kudu instance:

```javascript
var kudu = require("kudu");

// Import some controllers
var homeCtrl = require("homeCtrl");
var personCtrl = require("personCtrl");
var notFoundCtrl = require("notFoundCtrl");

    var options = {};

    // Specify the routes
    var routes = {
        home: {path: 'home', ctrl: homeCtrl}
        person: {path: 'person', ctrl: personCtrl}
        notFound: {path: '*', ctrl: notFound}
    };
    options.routes = routes;

// Initialize kudu with the given routes and a target id (#someId) where the views will be rendered to
    kudu.init({
        target: "#container",
        routes: routes
});
```

Kudu options
------------

Kudu.init() accepts the following options:

```javascript
options = {
			target: // a CSS id selector specifying the DOM node where Views will be rendered to eg "#container",
			routes: // an object mapping URLs to Controller modules,
			defaultRoute: // the default route to load if no URL is specified eg. http://host/
			unknownRouteResolver: // a function that is called if none of the registered routes matches the URL,
			intro: // a function for performing animations when showing the View,
			outro: // a function for performing animations when removing the View,
			fx: // Specify weather effects and animations should be enabled or not, default is false,
			viewFactory: // Provides a hook for creating views other than Ractive instances. See ViewFactory section below
		};
```

unknownRouteResolver
--------------------
An optional function passed a kudu instance that is called if none of the registered routes matches the URL. This allows users to inject
custom logic to handle this situation.

The function must return a promise which resolves to a route. If the promise is rejected the "notFound" route will be used.

ViewFactory
-----------

A ViewFactory provides global hooks for cretaing, rendering and unrendering views from the DOM.

A custom ViewFactory must provide three functions:

```javascript
var CustomFactory = {

    createView: function(options) {
        return promise;
    }

    renderView: function(options) {
        return promise;
    }

    unrenderView: function(options) {
        return promise;
    }
}

options contain the following:
	var options = {
    args: an object that was passed to a new view from the current view
    ctrl: the controller to create
    mvc: the current view/controller instance
    route: the route object to create a new view for
    routeParams: the URL parameters
    target: the CSS selector where the view must be rendered to
    viewOrPromise: an object that was returned from the controller onInit() function, either a view or a promise that resolves to a view
};
```

_createView_ must return a promise that resolves to the new view instance. This view instance will be passed to the _renderView_ function

_renderView_ must return a promise that resolves once the view has been rendered to the DOM.

_unrenderView_ must return a promise that resolves once the view has been removed from the DOM.

intro / outro
-------------
These functions provides global hooks for performing animation when showing and hiding views. These functions will be invoked whenever a
view is rendered and unrendered. Note: you can also provide fune grained animations on a per view basis by providing enter/leave functions
in the _route_ object.

intro is called after the view is rendered to the DOM. Here you can provide animations on the view eg. fade the view in

outro is called before the view is removed from the DOM. Here you can provide animations on the view eg. fade the view out

The functions have the following format:
```javascript
var intro = function (options, done) {
}
```

options contain the following value:
options: {
				target: // the CSS selector where the view was rendered to,
};

The "done" argument is a function to be called once the animation is finished to let kudu know the view is complete.

Router
------
Kudu includes a router that maps url paths to controllers.

The application routes are specified as an object with key/value pairs where each key is the name of the route and the value is the route.

For example:

```javascript
var routes = {
			home: {path: '/home', ctrl: customer},
			customer: {path: '/customer', ctrl: customer},
			notFound: {path: '*', ctrl: notFound} // if none of the routes match the url, the route defined as, '*', will match and it's controller invoked.
		};

kudu.init({
    target: "#container",
    routes: routes;
});
```

Routes
------

Routes consist of the following options:

```javascript
{
    path:     // this is the url path to match
    ctrl:     // if the path matches a url, this controller will be instantiated, alternatively specify the 'moduleId' option for lazy loading of the controller
    moduleId: // if the path matches a url, the controller with this ID will be instantiated, alternatively specify the 'ctrl' option for eager loading of the controller
    enter:    // a function for manually adding the view to the DOM and to perform custom intro animations. By default kudu insert views into the default target
    leave:    // a function for manually removing the view from the DOM and to perform custom outro animations. By default kudu remove views from the default target
}
```

New routes can also be added to router through the __addRoute__ method.

```javascript
var router = require("kudu/router/router");

router.addRoute(
    path: "/path", {
     ctrl: HomeCtrl, //either specify ctrl or moduleId
     // moduleId: "/app/ctrl/Home",
    enter: function(view, prevView, ctrl, prevCtrl) {}, // options {ctrl, prevCtrl, route, prevRoute, view, prevView, target}
    leave: function(view, prevView, ctrl, prevCtrl) {}  // options {ctrl, prevCtrl, route, prevRoute, view, prevView, target}
});
```

Process flow
------------

Here is order of calls when URL changes
prevRoute is stored
route = router.getRoute("path");
ctrl = route.ctrl
prevCtrl.onRemove
view = ctrl.onInit
prevRoute.leave(view, prevView); // if "leave" callback not implemented we do fadeOut and unrender/remove automatically
route.enter(view, prevView); // if "enter" callback not implemented we do render/insert and fadeIn automatically


Controller
----------
Controllers are AMD modules that must implement an "onInit" function which returns a Ractive View instance or a Promise which resolves
to a Ractive View instance.

Example controller:

```javascript
    define(function (require) {

        var template = require("rvc!./home");
	
        function homeCtrl() {
		
            var that = {};

            that.onInit = function(options) {
                var data = {hello: "Hello World"};
                var view = new template( { data: data } );
                return view;
            }
		
            return that;
        }
        return homeCtrl;
    });
```

In the home controller above the onInit function is implemented. onInit receives an "options" object and must return the view.

In kudu the views are Ractive instances, consisting of an HTML template and data. Ractive binds the HTML template and data to form the view.

The onInit function of a controller must return a Ractive instance or a promise which resolves to a Ractive instance.

The Ractive HTML template is imported as an AMD module through the "rvc" plugin. This plugin transforms an HTML Ractive template by compiling
it to a Ractive function ready to be instantiated.


onInit
------

Controllers in kudu must implement an onInit method. onInit must return a Ractive view instance or function (kudu will instantiate it if needed)
or a promise which resolves to a Ractive view instance or function.

onInit options
--------------

The following options are passed to the onInit method:

options = {
  ajaxTracker: provides a means of registering ajax calls in the controller. Ajax calls tracked this way will automatically abort when the view
is removed. ajaxTracker also provides a way to listen to ajax lifecycle events such as ajax.start / ajax.stop etc.

routeParams: all URL parameters (including segment parameters and query parameters) are passed to the controller through the routeParams object.
args: arguments passed to the controller from another controller. args can only be passed to a view when called from a controller, not when navigating via the URL hash
}


onRemove
--------

Controllers can optionally implement the onRemove method. This method controls whether the view can be removed or not. onRemove must return
either true or false or a promise that resolves to true or false.
If onRemove returns true, the view will be removed. If false, the request will be cancelled and the view will not be removed.

onRemove options
----------------


Gobal events
------------

You can subscribe to global events fired by kudu as follows:

```javascript
var kudu = require("kudu/kudu");
$(kudu).on('viewInit', function (e, options) {
    // called whenever a view has been initialized
});
```
	
The following global events exist:
viewBeforeInit     : called before the controller.onInit method is called
viewInit           : called after the controller.onInit method is called
viewRender         : called after the controller's Ractive view has been added to the DOM
viewComplete       : called after the controller's Ractive view has been rendered and completed any transitions
viewBeforeUnrender : called before view is removed from the dom. this event only occurs if the Controller.onRemove method returns true
viewUnrender       : called after the controller's Ractive view has been removed from the DOM

Global event options
--------------------
The following options are passed to the events:

options = {
    prevCtrl     : previous controller which is being removed
    newCtrl     : new controller being added
    isMainCtrl  : (experimental) true if the new controller replaces the main view eg the target specified in kudu initialization is replaced. If false
                  it means the new controller is a sub view on another controller
    ctrlOptions : all the options used for the new controller
		eventName   : name of the event which fired
		error       : optionally specifies the error / errors which lead to the event being triggered   
}

The following events exist on a controller:
onInit     : the initialization event which must be implemented by each controller
onRender   : called after the view has been added to the DOM
onComplete : called after the view has been added to the DOM AND once all transitions has completed.
onRemove   : called before removing the controller
onUnrender : called after the view has been removed from the DOM

Example:
--------

```javascript
define(function (require) {

        var template = require("rvc!./home");
	
        function homeCtrl() {
		
            var that = {};

            that.onInit = function(options) {
            
                var view = new template();
                return view;
            }

            that.onRender = function(options) {
                // View has been added to the DOM
            }

            that.onComplete = function(options) {
                // view has been added to the DOM and transitions completed
            }
		
            return that;
        }
        return homeCtrl;
    });
```

Routing
-------

The following routing logic is supported:

* Segment parameters are specified as a colon with a name eg: /person:id
The following url will match this route:
/person/1

* Query parameters are specified as ampersand separated values after the questionmark eg: /person?id&name
The following url will match this route:
/person?id=1&name=bob

* Wildcards are specified as an asterisk eg: /view/*/person
The following url will match this route:
/view/anything/person
