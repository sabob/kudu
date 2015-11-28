var requirejs = require('requirejs');

module.exports = function(config, done) {
	requirejs.optimize(config, function (buildResponse) {
		done();

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
	}, function (err) {
		console.log(err);
		throw err;
		//optimization err callback
	});
}