var program = require('commander');
var nodeJsConfig = require('nodejs-config');
var optimize = require('./optimize');
var fs = require('fs-extra');

var config = null;

function setupCLI() {
	commander = program
			.version('0.0.1')
			.option('-p, --prod', 'Build production')
			.option('-d, --dev', 'Build development');
	commander.parse(process.argv);
}

function setupConfig() {
	config = nodeJsConfig(
			__dirname, // an absolute path to your applications 'config' directory

			function () {
				//return process.env.NODE_ENV;
				if (program.prod) {
					return "prod";
				} else if (program.dev) {
					return "dev";
				}
			}
	/*
	 {
	 prod: ['localhost'],
	 preprod: ['boblap']
	 }*/
	);
}

setupCLI();
setupConfig();

// Read in the build config file
var rConfig = fs.readFileSync("./config/r.build.js", 'utf8');
rConfig = eval(rConfig);
optimize(rConfig, function() {
	
});


console.log("app: ", config.get('app').name);
console.log(config.environment());