/* modules: 
 * https://www.npmjs.com/package/requirejs
 */

var requirejs = require('requirejs');

var promise = new Promise(function (resolve, reject) {

	module.exports = function (rConfig, appConfig) {
		
		// Set the r.js build version to our app version
		rConfig.version = appConfig.version;

		requirejs.optimize(rConfig, function (buildResponse) {

			// TODO replace uncommen jquery	

			//fs.unlinkSync(source);
			//console.log('deleted ' + source);
			/*
			 copyFile(source, target, function () {
			 console.log(source + " renamed to " + target);
			 });*/
			//buildResponse is just a text output of the modules
			//included. Load the built file for the contents.
			//Use source to get the optimized file contents.
			//var contents = fs.readFileSync(source, 'utf8');

			resolve(buildResponse);

		}, function (err) {
			console.log(err);
			reject(err);
			//optimization err callback
		});
		
		return promise;
	}
});