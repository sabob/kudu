var cli = require('./scripts/cli');
var config = require('./scripts/config');
var optimize = require('./scripts/optimize');
var fs = require('fs-extra');

// Read in the build config file
var rConfig = fs.readFileSync("./config/r.build.js", 'utf8');
rConfig = eval(rConfig);
optimize(rConfig, function() {
	
});

console.log("app: ", config.get('app').name);
console.log(config.environment());