var sketchModule = require('./count-min-sketch.js')

// major browsers list
var majorBrowsers = [
'Chrome',
'Explorer',
'Edge',
'Firefox',
];

module.exports = {}
module.exports.onLogin = function(userAgent) {
	/* 
	very simple count min sketch usage
	we'll count the browsers of users
	*/
	var i;
	for(i = 0; i < majorBrowsers.length; i++) {
		if(userAgent.toLowerCase().indexOf(majorBrowsers[i].toLowerCase()) != -1){
			sketchModule.update(majorBrowsers[i], 1);
		}
	}
	sketchModule.update(userAgent, 1);
}
