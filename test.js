var proxysocket = require('proxysocket');
var http = require('http');
var socket0 = proxysocket.create('localhost', 9051);
var socket1 = proxysocket.create('localhost', 9052);

//var agent = proxysocket.createAgent();
//var socket = agent.createConnection({host:'localhost', port:9050});

/*
http.request({
    host: 'https://www.google.com',
//    agent: agent
});
//*/

socket0.connect('bitmesh.network', 80, function () {
    console.log('connected');
    socket0.write('get\n\n');
    // Connected
});

socket0.on('data', function (data) {
 	console.log('data' + data);  
    // Receive data
});

socket0.on('error', function (error) {
	console.log('error ' + error);
});

socket1.connect('bitmesh.network', 443, function () {
    console.log('connected');
    socket1.write('get\n\n');
    // Connected
});

socket1.on('data', function (data) {
 	console.log('data' + data);  
    // Receive data
});

