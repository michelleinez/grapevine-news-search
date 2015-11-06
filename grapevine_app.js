var express = require('express');
var app = express();
app.use(express.static('public'));
var server = require('http').Server(app);
var grapevine = require('./grapevine');
var io = require('socket.io')(server);

server.listen(8081);

io.on('connection', function (socket) {
	var search_query;
	socket.emit('ack', {});
	socket.on('search', function (data) {
		search_query = data;
		console.log(search_query);
	});
	socket.on('countries', function (data) {
		var countries = JSON.parse(data).countries;
		console.log(countries);		
		var grapes = function(i)
		{
			console.log("grapes(" + i + ")");
			grapevine.simulate_country(search_query, countries[i], function(result){
				console.log('country simulated ' + countries[i]);
				socket.emit('news', { country_code: countries[i], news: result });
			});			
		}
		for (var i = 0; i < countries.length; i++)
		{
			grapes(i);
		}
	});
	socket.on('error', function (err) {
		console.log("Error: " + err);
	});
});
/*
	grapevine.simulate_country('gorilla attacks', '', function(result){
		res.send(geo);
	});
*/