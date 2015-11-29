// modules: https://www.npmjs.com/package/fs-extra

var cli = require('./mods/cli');
var config = require('./mods/config');
var optimize = require('./mods/optimize');
var fs = require('fs-extra');

// Read in the build config file
var rConfig = fs.readFileSync("./config/r.build.js", 'utf8');
rConfig = eval(rConfig);

optimize(rConfig, function() {
		
});

console.log("app: ", config.get('app').name) ;
console.log(config.environment());