
var grapevine = require('./grapevine');

//grapevine.translate(search_query, from_language, to_language);
//grapevine.get_news_about(search_query, 'en');
grapevine.check_ip_for_country('us', function(result){
	console.log(result);
});
