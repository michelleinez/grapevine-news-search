var grapevine = require('./grapevine');
var search_query = 'search';
var from_language = 'en'; to_language = 'fr';


grapevine.get_json_from_api(
	'www.googleapis.com',
	'/language/translate/v2?key='+grapevine.API_KEY+'&q='+search_query+'&source='+from_language+'&target='+to_language,
	grapevine.get_socket_for_country(), 
	function(result){
		console.log(result);
	});

/*
grapevine.get_json_from_api(
	'www.ajax.googleapis.com',
	'/ajax/services/search/news?v=1.0',
	grapevine.get_socket_for_country(), 
	function(result){
		console.log(result);
	});
	*/