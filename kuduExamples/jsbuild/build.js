/* modules: 
 * https://www.npmjs.com/package/fs-extra
 * https://www.npmjs.com/package/glob
 * https://www.npmjs.com/package/node-version-assets
*/

var cli = require('./mods/cli');
var config = require('./mods/config');
var optimize = require('./mods/optimize');
var fs = require('fs-extra');
var versioning = require("node-version-assets");
var glob = require("glob");

// Read in the build config file
var rConfig = fs.readFileSync("./config/r.build.js", 'utf8');
rConfig = eval(rConfig);

optimize(rConfig).then(function (buildResponse) {
	renameConfigToRequire(rConfig);
	versionAssets(rConfig);
	console.log("Build completed successfully!");
});

function versionAssets(rConfig) {

	var versionInstance = new versioning({
		assets: [rConfig.dir + '/css/site.css', rConfig.dir + '/js/lib/require.js'],
		grepFiles: [rConfig.dir + '/index.jsp']
	});
	versionInstance.run();

}

function renameConfigToRequire(rConfig) {
	var source = rConfig.dir + "js/app/config/config.js";
	var target = rConfig.dir + "js/lib/require.js";

	fs.renameSync(source, target);
	console.log(source + " renamed to " + target);
}

console.log("Running build in", config.environment(), "mode");