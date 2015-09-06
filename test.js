var proxysocket = require('proxysocket');

var grapevine = require('./grapevine');

var API_KEY = 'AIzaSyBfnsOwVWHgYMZeqILWCoUwjJyomzpsV_Y';
var search_query = 'search term (replace later)';
var from_language = 'en';
var to_language = 'fr';

//*/
var socket = proxysocket.create('localhost', 9050);

function get_json_from_api(host, path, socket, callback)
{
	if (socket === undefined)
	{
		console.log('socket was undefined');
		return;
	}

	var response_string = '';

	socket.on('data', function (data) {
		response_string += data;
	    // Receive data
	});

	socket.on('end', function(){
		var json_string = response_string.replace(/(\n|.|\r)*?(?={)/m, '');
	 	var json = JSON.parse(json_string);
	 	callback(json);
	});

	socket.connect(host, 80, function () {
	    console.log('connected');
		socket.write('GET ' + path + ' HTTP/1.0\n\n');
	    // Connected
	});
}

get_json_from_api(
	'http://www.googleapis.com',
	'/language/translate/v2?key='+API_KEY+'&q='+search_query+'&source='+from_language+'&target='+to_language,
	socket, 
	function(result){
		console.log(result.results);
	});


var API_KEY = 'AIzaSyBfnsOwVWHgYMZeqILWCoUwjJyomzpsV_Y';
var search_query = 'monkeys';
var from_language = 'en';
var to_language = 'fr';

translate(search_query, from_language, to_language);


