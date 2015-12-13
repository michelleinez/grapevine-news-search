var socks = require('socksv5');
var https = require('https');
var http = require('http');
//var host = 'www.googleapis.com';
var host = 'ajax.googleapis.com';
var path = '/ajax/services/search/news?v=1.0&q=gender';
//var path = '/language/translate/v2?key=AIzaSyBfnsOwVWHgYMZeqILWCoUwjJyomzpsV_Y&source=en&target=fr&q=hello';

var socksConfig = {
  proxyHost: '127.0.0.1',
  proxyPort: 9050,
  auths: [ socks.auth.None() ]
};

https.get({
  host: host,
  port: 443,
  method: 'GET',
  path: path,
  agent: new socks.HttpsAgent(socksConfig)
}, function(res) {
  res.resume();
	res.on('data', function(d) {
	    process.stdout.write(d);
	  });
});

/*
https.get({
  host: host,
  port: 443,
  method: 'HEAD',
  path: path,
  agent: new socks.HttpAgent(socksConfig)
}, function(res) {
  res.resume();
  console.log(res.statusCode, res.headers);
});

*/