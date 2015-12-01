/**
 * Run this file with
 * build>node r.js -o r.build.js
 * OR use build.js
 * 
  * NOTE: The properties appDir, dir, mainConfigFile, out, wrap.startFile, wrap.endFile are relative to the build folder: jsbuild
  * For baseUrl, it is relative to appDir
  * For paths and packages, they are relative to baseUrl, just as they are for require.js.
 */

({
    appDir: "../web/src",
   baseUrl: "js/lib",
    dir: "../build/web", // output folder of build
    //optimize: 'uglify',
    optimize: 'none',
	fileExclusionRegExp: /^node_modules$|^bower_components$/,
    removeCombined: true,
    skipDirOptimize: true,
	preserveLicenseComments: false,
	optimizeCss: 'standard',
    "mainConfigFile": "../web/src/js/app/config/config.js",
	//"mainConfigFile": "../src/js/tmp-config.js", // this file is dynamically crreated by copying ../src/js/config.js to build/tmp-config.js. This is done in build.js
	//name: "config",
    paths: {
        "config": "../app/config/config",
        "requireLib": "require"
        //,"jquery": "empty:"
		//,"ractive": "empty:"
    },
	
	//stubModules: [ 'rvc', 'text', "ractive", "jquery" ],
	stubModules: [ 'rvc', 'rv', 'text' ],
	//stubModules: [ 'rvc', 'text' ],
    
    modules: [
        {
            name: "config",
            include: [
                "requireLib"
            ]
        }
    ],
    
    onBuildWrite: function( name, path, contents ) {
		/* 
		 * Here we can manipulate the build furter by replacing values in the build output.
		 * 
        if (name === 'handlebars') {
            return null;
        }
        if (name === "handlebars-runtime") {
            // Replace the AMD name 'handlebars-runtime' with just 'handlebars', otherwise handlebars dependencies will not find it
            // and attempt to download it again
            contents = contents.replace("define('handlebars-runtime'", "define('handlebars'");
            
            // Same thing as above but check for double quotes
            contents = contents.replace('define("handlebars-runtime"', 'define("handlebars"');
        }*/
        return contents;
    }
})
