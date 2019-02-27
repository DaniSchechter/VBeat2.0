var sketchModule = require('./count-min-sketch.js')

// major browsers list
var majorBrowsers = [
'Chrome',
'Edge',
'Firefox',
];

module.exports = {}
module.exports.onLogin = function(userAgent) {
	/* 
	very simple count min sketch usage
	we'll count the browsers of users
	*/

	if(userAgent == undefined) {
		return;
	}
	var i;
	for(i = 0; i < majorBrowsers.length; i++) {
		if(userAgent.toLowerCase().indexOf(majorBrowsers[i].toLowerCase()) != -1){
			sketchModule.update(majorBrowsers[i], 1);
		}
	}
	sketchModule.update(userAgent, 1);
}

module.exports.getData = function(){
	var dict = {};
	for(var i = 0; i < majorBrowsers.length; i++) {
		var curBrowser = majorBrowsers[i];
		dict[curBrowser] = sketchModule.query(curBrowser);
	}
	return dict;
}
