//  grapevine setup
var https = require('https');
var socks = require('socksv5');
var exec = require('child_process').exec;
var querystring = require('querystring');
var striptags = require('striptags');
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
	base_control_port: 15000,
	API_KEY: 'AIzaSyBfnsOwVWHgYMZeqILWCoUwjJyomzpsV_Y',

	init: function(callback) {

		// kill all tor instances
		exec('killall tor', function(error, stdout, stderr) {
	   		if (error) {
		   		console.log(error);
		   		console.log(stderr);
	   		}
		});

		var i = 1;
		for (key in this.countries) {
			var socksPort = this.base_socks_port + i;
			var controlPort = this.base_control_port + i;
			this.countries[key].socksPort = socksPort;
			this.countries[key].controlPort = controlPort;

			var pidFilename = 'tor' + i + '.pid';
			var dataDirectory = 'data/tor' + i;
			var exitNode = '{' + key + '}';
			var torCommand = 'tor --RunAsDaemon 1 --CookieAuthentication 0 --HashedControlPassword "" --ControlPort ' + controlPort + ' --PidFile ' + pidFilename + ' --SocksPort ' + socksPort + ' --DataDirectory ' + dataDirectory + ' --ExitNodes ' + exitNode;
			i++;
		   	exec(torCommand, function(error, stdout, stderr){
		   		if (error) {
			   		console.log(error);
			   		console.log(stderr);
		   		}
		  	});
		}	

		callback();	
	},
	//https call to google translate API
	translate: function(search_query, from_language, to_language, callback){
		// URL encode the search string
		search_query = querystring.escape(search_query);

		//console.log(search_query);
		var httpOptions = {
			host: 'www.googleapis.com',
			port: 443,
			path: '/language/translate/v2?key='+this.API_KEY+'&source='+from_language+'&target='+to_language+'&q='+search_query,
			method: 'GET'
		};
//		console.log(httpOptions.host + httpOptions.path);

		var req = https.request(httpOptions, function(res) {
//			console.log("statusCode: ", res.statusCode);
//			console.log("headers: ", res.headers);
			var response_string = '';
			res.on('data', function(d) {
				response_string += d;
			});
			res.on('end', function() {
				callback(JSON.parse(response_string))
			});
			res.on('error', function(err) {
				console.log('Error: ' + err);
			});
		});
		req.end();

		req.on('error', function(e) {
			console.error('Error: ' + e);
		});
	},
	// hit news api with search term, sending request thru appropriate tor instance
	get_news_about: function(search_query, country_code, callback){
		// URL encode the search string
		search_query = querystring.escape(search_query);
//		var torPort = this.base_socks_port + this.country_codes.indexOf(country_code);
		var torPort = 9050;
//		console.log('getting news about ' + search_query + ' from country ' + country_code);

		// tor config
		var socksConfig = {
		  proxyHost: '127.0.0.1',
		  proxyPort: torPort,
		  auths: [ socks.auth.None() ]
		};
		// request config
		var httpOptions = {
			host: 'ajax.googleapis.com',
		  	port: 443,
		  	path: '/ajax/services/search/news?v=1.0&q=' + search_query,	
		  	method: 'GET',
	 		agent: new socks.HttpsAgent(socksConfig)
		};
//		console.log(httpOptions.host + httpOptions.path);

		var req = https.request(httpOptions, function(res) {
			res.resume();
			var response_string = '';
			res.on('data', function(d) {
				response_string += d;
			});
			res.on('end', function() {
				callback(JSON.parse(response_string));
//				consople.log(response_string);
			});
			res.on('error', function(err) { 
				console.log('Error: ' + err);
			});
		});
		req.end();

		req.on('error', function(e) {
			console.error('Error: ' + e);
		});
	},
	check_ip_for_country: function(country_code, callback) 
	{
		// Liam plz help


		// should derive torPort from country_code
		var torPort = 9050;	
		var socksConfig = {
		  proxyHost: '127.0.0.1',
		  proxyPort: torPort,
		  auths: [ socks.auth.None() ]
		};

		var httpOptions = {
			// this is ip of "whatsmyip" server
			host: '104.197.87.137',
		  	port: 80,
		  	path: '/',	
		  	method: 'GET',
	 		agent: new socks.HttpAgent(socksConfig)
		};

		var req = http.request(httpOptions, function(res) {
			res.resume();
			var response_string = '';
			res.on('data', function(d) {
				response_string += d;
			});
			res.on('end', function() {
				callback(JSON.parse(response_string));
			});
			res.on('error', function(err) { 
				console.log('Error: ' + err);
			});
		});
		req.end();

		req.on('error', function(e) {
			console.error('Error: ' + e);
		});
	},
	simulate_country: function(search_query, country_code, callback)
	{
		var that = this;
		var from_language = 'en';
		var to_language = 'fr';
		this.translate(search_query, from_language, to_language, function(result){
			var translation = result.data.translations[0].translatedText;
			//translation = querystring.escape(translation);
			//console.log(translation);
			that.get_news_about(translation, country_code, function(result){
				var news_stories = [];
				var translated = 0;
				var results = result.responseData.results;
				var translator = function(i)
				{
					that.translate(news_stories[i].summary, to_language, from_language, function(result){
						var translation = result.data.translations[0].translatedText;
						news_stories[i].summary = translation;
						that.translate(news_stories[i].title, to_language, from_language, function(result){
							var translation = result.data.translations[0].translatedText;
							news_stories[i].title = translation;
							console.log('news_stories[' + i + '] = ' + news_stories[i].title + ': ' + news_stories[i].summary);
							if (++translated == news_stories.length)
							{
								callback(news_stories);
							}
						});
					});
				}
				for (var i = 0; i < results.length; i++)
				{
					var news_story = {
						title: results[i].titleNoFormatting,
						summary: results[i].content,
						url: results[i].unescapedUrl,
						imageUrl: results[i].image.url,
					};
					news_story.summary = striptags(news_story.summary);
					//news_story.title = striptags(news_story.title);
					news_stories.push(news_story);
					translator(i);
				}
//				console.log(news_stories);
			});
		});
	}
};

module.exports = grapevine;

