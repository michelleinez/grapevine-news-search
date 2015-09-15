//  grapevine setup
var https = require('https');
var socks = require('socksv5');

var grapevine = {
	countries: {
		be: {
			country_code:'be',
			country_name:'Beryllium',
			language_code:'??',
			language_name:'Basilisk'
		},
		pl: {
			//...
		}
	},
	country_codes: ["be","pl","ca","za","vn","uz","ua","tw","tr","th","sk", 
    "sg","se","sd","sa","ru","ro","pt","ph","pa","nz","np","no","my","mx", 
    "md","lv","lu","kr","jp","it","ir","il","ie","id","hr","hk","gr","gi", 
    "gb","fi","es","ee","dk","cz","cy","cr","co","cn","cl","ci","ch","by", 
    "br","bg","au","at","ar","aq","ao","ae","nl","de","fr"],
	
	base_socks_port:9050,
	API_KEY: 'AIzaSyBfnsOwVWHgYMZeqILWCoUwjJyomzpsV_Y',
	get_json_from_api: function(host, path, socket, callback)
	{
		if (socket === undefined)
		{
			socket = proxysocket.create('localhost', 9050);
			console.log('socket was undefined');
			return;
		}

		var response_string = '';

		socket.on('data', function (data) {
			// this may be called multiple times for a given response, as the data is broken into chunks, 
			// so we simply store it until we have all of it
			response_string += data;
		    // Receive data
		});

		socket.on('end', function(){
			var json_string = response_string.replace(/(\n|.|\r)*?(?={)/m, '');
			console.log(json_string);
		 	//var json = JSON.parse(json_string);
		 	console.log("parsed json");
		 	//callback(json);
		});

		socket.on('error', function(error){
			console.log('error' + error);
		});

		socket.connect(host, 80, function () {
		    console.log('connected');
		    var request = 'GET ' + path + ' HTTP/1.0\n\n';
		    console.log(request); 
			socket.write(request);
		    // Connected
		});
	},
	get_socket_for_country: function(country_code)
	{
		var agent = proxysocket.createAgent('localhost', 9050);

		return proxysocket.create('localhost', 9050);
		/*
		int idx = this.country_codes.indexOf(country_code);
		if (idx >= 0)
		{
			return proxysocket.create('localhost', this.base_socks_port + idx);
		}
		*/
	},
	//https call to google translate API
	translate: function(search_query, from_language, to_language, callback){
		var options = {
			host: 'www.googleapis.com',
			port: 443,
			path: '/language/translate/v2?key='+this.API_KEY+'&source='+from_language+'&target='+to_language+'&q='+search_query,
			method: 'GET'
		};

		//console.log(options);

		var req = https.request(options, function(res) {
//			console.log("statusCode: ", res.statusCode);
//			console.log("headers: ", res.headers);
			var response_string = '';
			res.on('data', function(d) {
				response_string += d;
			});
			res.on('end', function() {
				callback(JSON.parse(response_string))
			});
		});
		req.end();

		req.on('error', function(e) {
			console.error(e);
		});
	},
	get_news_about: function(search_query, country_code, callback){
		var host = 'ajax.googleapis.com';
		var path = '/ajax/services/search/news?v=1.0&q=' + search_query;
//		var torPort = this.base_socks_port + this.country_codes.indexOf(country_code);
		var torPort = 9050;
		console.log('getting news about ' + search_query + ' from country ' + country_code);
		var socksConfig = {
		  proxyHost: '127.0.0.1',
		  proxyPort: torPort,
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
			var response_string = '';
			res.on('data', function(d) {
				response_string += d;
			});
			res.on('end', function() {
				callback(JSON.parse(response_string));
//				console.log(response_string);
			});
		});
	},
	simulate_country: function(search_query, country_code)
	{
		this.translate(search_query, 'en', 'fr', function(result){
			console.log(result);
		});
	}
};

module.exports = grapevine;

