// modules: https://www.npmjs.com/package/commander

var program = require('commander');

var commander = program
		.version('0.0.1')
		.option('-p, --prod', 'Build production')
		.option('-d, --dev', 'Build development');
commander.parse(process.argv);

module.exports = program;