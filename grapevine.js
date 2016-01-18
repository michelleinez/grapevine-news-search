//  grapevine setup
var https = require('https');
var http = require('http');
var socks = require('socksv5');
var countries_json = require('./countries.json');
var googleApiKey = require('./api_key.json');
var exec = require('child_process').exec;
var querystring = require('querystring');
var striptags = require('striptags');
var log4js = require('log4js');
log4js.configure({
  appenders: [
//    { type: 'console' },
    { type: 'file', filename: 'grapevine.log' }
  ]
});
var logger = log4js.getLogger();
var grapevine = {
	countries: countries_json,
	base_socks_port: 9050,
	base_control_port: 15000,
	API_KEY: googleApiKey.key,

	// setting this to true makes everything use a single tor instance on port 9050
  // instead of a different tor instance for each country
	debug: true,
	init: function(callback) {
		if (this.debug) {
			return callback();
		}
		var that = this;
		// kill all tor instances
		exec('killall tor', function(error, stdout, stderr) {
	   		if (error) {
	   			logger.warn('No tor instances to kill');
	   			logger.warn(error);
	   		}
			var i = 1;
			var j = 0;
			for (key in that.countries) {
				var socksPort = that.base_socks_port + i;
				var controlPort = that.base_control_port + i;
				that.countries[key].socksPort = socksPort;
				that.countries[key].controlPort = controlPort;

				var pidFilename = 'tor' + i + '.pid';
				var dataDirectory = 'tor_data/tor' + i;
				var exitNode = '{' + key.toLowerCase() + '}';
				var torCommand = 'tor --RunAsDaemon 1 --PidFile ' + pidFilename + ' --SocksPort ' + socksPort + ' --DataDirectory ' + dataDirectory + ' --ExitNodes ' + exitNode;
				i++;
		        exec(torCommand, function(error, stdout, stderr){
		          if (error) {
		          	logger.warn('tor command failed: ' + torCommand);
		            logger.warn(error);
		          } 
		          else {
		          	logger.info('Successfully connected via ' + torCommand.substring(torCommand.length - 3));
		          }
		          j++;
		          if (j >= Object.keys(that.countries).length)
		          {
		            callback();
		          }
		        });
					}
				});
	},
	//https call to google translate API
	translate: function(search_query, from_language, to_language, callback){
		if (from_language.toLowerCase() == to_language.toLowerCase()) {
			return callback(search_query);
		}

		// URL encode the search string
		search_query = querystring.escape(search_query);

		var httpOptions = {
			host: 'www.googleapis.com',
			port: 443,
//			path: '/language/translate/v2?key=' + this.API_KEY + '&source=' + from_language + '&target=' + to_language + '&q=' + search_query,
			path: '/language/translate/v2?key=' + this.API_KEY + '&target=' + to_language + '&q=' + search_query,
			method: 'GET'
		};
		logger.debug(httpOptions.host + httpOptions.path);

		var request = https.request(httpOptions, function(response) {
			logger.debug("statusCode: ", response.statusCode);
			logger.debug("headers: ", response.headers);
			var response_string = '';
			response.on('data', function(d) {
				response_string += d;
			});
			response.on('end', function() {
				var translation;
				var response_data = JSON.parse(response_string).data;
				if (response_data) {
					translation = response_data.translations[0].translatedText;
				}
				else {
					translation = 'No translation available.';
				}
				callback(translation);
			});
			response.on('error', function(err) {
				logger.warn('Error receiving translation api response: ' + err);
        		logger.warn('Trying again');
        		logger.warn('Is google apis working?');
        		grapevine.translate(search_query, from_language, to_language, callback);
			});
		});
		request.end();

		request.on('error', function(err) {
			logger.warn('Error sending translation api request: ' + err);
	      	logger.warn('Trying again');
      		grapevine.translate(search_query, from_language, to_language, callback);
		});
	},
	// hit news api with search term, sending request thru appropriate tor instance
	get_news_about: function(search_query, country_code, language_code, result_start, callback){
		// URL encode the search string
		search_query = querystring.escape(search_query);
		var torPort;
		if (this.debug)
		{
			torPort = 9050;
		}
		else
		{
			torPort = this.countries[country_code].socksPort;
		}
//		var torPort = 9050;
		logger.info('getting news about ' + search_query + ' from country ' + country_code);

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
		  	path: '/ajax/services/search/news?v=1.0&ned=' + country_code + '&start=' + result_start + '&rsz=8&hl=' + language_code + '&q=' + search_query,
		  	method: 'GET',
	 		agent: new socks.HttpsAgent(socksConfig)
		};
		logger.info(httpOptions.host + httpOptions.path);

		var request = https.request(httpOptions, function(response) {
			response.resume();
			var response_string = '';
			response.on('data', function(d) {
				response_string += d;
			});
			response.on('end', function() {
				var response_json = JSON.parse(response_string);
				callback(response_json);
			});
			response.on('error', function(err) {
				logger.warn('Error receiving news api response: ' + err);
				logger.warn('Trying again');
        		logger.warn('Is google apis working?');
        		get_news_about(search_query, country_code, language_code, result_start, callback);
			});
		});
		request.end();

		request.on('error', function(err) {
			logger.warn('Error sending news api request: ' + err);
			logger.warn('Trying again');
    		logger.warn('Is google apis working?');
    		get_news_about(search_query, country_code, language_code, result_start, callback);

		});
	},
	check_ip_for_country: function(country_code, callback)
	{
		var country = this.countries[country_code];
		if (country === undefined) {
			logger.error('No country found for country code: ' + country_code);
			return;
		}
		// should derive torPort from country_code
//		var torPort = 9050;
		var torPort = country.socksPort;
		var socksConfig = {
		  proxyHost: '127.0.0.1',
		  proxyPort: torPort,
		  auths: [ socks.auth.None() ]
		};

		var httpOptions = {
			// this is ip of "whatsmyip" server
			host: '130.211.135.85',
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
				var json = JSON.parse(response_string);
				var exit_node_country = json.country;
				callback(exit_node_country.toLowerCase().trim(), country_code.toLowerCase().trim());
			});
			res.on('error', function(err) {
				logger.warn('Error receiving response to request' + httpOptions);
				logger.warn(err);
			});
		});
		req.end();

		req.on('error', function(err) {
			logger.warn('Error sending request' + httpOptions);
			logger.warn(err);
		});
	},
	simulate_country: function(search_query, country_code, from_language, result_start, callback)
	{
	    logger.info('Searching ' + search_query + ' from ' + country_code);
		var that = this;
		var to_language = this.countries[country_code].language_code;
		this.translate(search_query, from_language, to_language, function(result){
			var translation = result;
			logger.info(search_query + '-->' + translation);
			that.get_news_about(translation, country_code, to_language, result_start, function(result){
				var news_stories = [];
				var translated = 0;
				var results = result.responseData.results;
				var translator = function(i)
				{
					that.translate(news_stories[i].untranslated_summary, to_language, from_language, function(result){
						news_stories[i].translated_summary = xhtmlUnescape(result);
						that.translate(news_stories[i].untranslated_title, to_language, from_language, function(result){
							news_stories[i].translated_title = xhtmlUnescape(result);
							//logger.info('news_stories[' + i + '] = ' + news_stories[i].translated_title + ': ' + news_stories[i].translated_summary);
							if (++translated == results.length)
							{
								callback(news_stories);
							}
						});
					});
				};
				var xhtmlUnescape = function(escapedXhtml) {
					escapedXhtml = escapedXhtml.replace(/&quot;/g, '"');
					escapedXhtml = escapedXhtml.replace(/&amp;/g, '&');
					escapedXhtml = escapedXhtml.replace(/&lt;/g, '<');
					escapedXhtml = escapedXhtml.replace(/&gt;/g, '>');
					escapedXhtml = escapedXhtml.replace(/&#39;/g, "'");
					escapedXhtml = escapedXhtml.replace(/&nbsp;/g, " ");

					return escapedXhtml;
				};
				for (var i = 0; i < results.length; i++)
				{
					var news_story = {
						untranslated_title: results[i].titleNoFormatting,
						untranslated_summary: results[i].content,
						url: results[i].unescapedUrl
					};
					if (results[i].image) {
						news_story.image_url = results[i].image.tbUrl;
					}

					news_story.untranslated_summary = xhtmlUnescape(striptags(news_story.untranslated_summary));
					news_story.untranslated_title = xhtmlUnescape(striptags(news_story.untranslated_title));
					news_stories.push(news_story);
					translator(i);
				}
			});
		});
	},
	shutdown : function (callback)
	{
		// kill all tor instances
		exec('killall tor', function(error, stdout, stderr) {
	   		if (error) {
		   		logger.warn(error);
		   		logger.warn(stderr);
	   		}
		});
		callback();

	}
};

module.exports = grapevine;
//99:37:9f:8d:d6:7b:5f:f0:3a:b1:f0:8c:71:bf:0a:d1
