var https = require('https');

var API_KEY = 'AIzaSyBfnsOwVWHgYMZeqILWCoUwjJyomzpsV_Y';
var search_query = 'monkeys';
var from_language = 'en';
var to_language = 'fr';

function translate(search_query, from_language, to_language){
	var options = {
	host: 'www.googleapis.com',
	  port: 443,
	  path: '/language/translate/v2?key='+API_KEY+'&source='+from_language+'&target='+to_language+'&q='+search_query,
	  method: 'GET'
	};

	console.log(options);

	var req = https.request(options, function(res) {
	  console.log("statusCode: ", res.statusCode);
	  console.log("headers: ", res.headers);

	  res.on('data', function(d) {
	    process.stdout.write(d);
	  });
	});
	req.end();

	req.on('error', function(e) {
	  console.error(e);
	});
};

translate(search_query, from_language, to_language);