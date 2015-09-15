
var grapevine = require('./grapevine');

var search_query = 'monkeys';
var from_language = 'en';
var to_language = 'fr';

//grapevine.translate(search_query, from_language, to_language);
//grapevine.get_news_about(search_query, 'en');
grapevine.simulate_country('hello', '');
/*
grapevine.get_json_from_api(
	'www.ajax.googleapis.com',
	'/ajax/services/search/news?v=1.0',
	grapevine.get_socket_for_country(), 
	function(result){
		console.log(result);
	});
	*/
