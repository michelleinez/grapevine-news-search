var proxysocket = require('proxysocket');

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
/*/

var agent = proxysocket.createAgent('localhost', 9050);
var socket = agent.createConnection({host:'maps.googleapis.com', port:80}, function(){
	socket.write('GET /maps/api/elevation/json?locations=39.7391536,-104.9847034 HTTP/1.0\n\n');
	console.log("connected");
});
socket.on('data', function(data) {
	console.log('data\n' + data);
});

/*/
/*/
var request = http.request({
    host: 'bitmesh.network',
    port: 80,
    agent: agent
}, function(response){
  console.log('STATUS: ' + response.statusCode);
  console.log('HEADERS: ' + JSON.stringify(response.headers));
  response.setEncoding('utf8');
  response.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

request.write('data\n');
request.write('data\n');
request.end();
/*/

//var agent = proxysocket.createAgent();
//var socket = agent.createConnection({host:'localhost', port:9050});
/*
var request = http.request({
    host: 'www.google.com',
    port: 80,
}, function(response){
	console.log(response);
});

request.end();*/
/*
var agent = proxysocket.createAgent('localhost', 9050);

var request = http.request({
    host: 'www.google.com',
    port: 80,
    agent: agent
}, function(response){
	console.log(response);
});

request.end();

socket.connect('bitmesh.network', 80, function () {
    console.log('connected');
    socket.write('get\n\n');
    // Connected
});

socket.on('data', function (data) {
 	console.log('data' + data);  
    // Receive data
});

socket.on('error', function (error) {
	console.log('error ' + error);
});
/*/

