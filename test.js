var countries_json = require('./countries.json');

var grapevine = require('./grapevine');

grapevine.init(function () {
	console.log('finished init');
	//grapevine.translate(search_query, from_language, to_language);
	//grapevine.get_news_about(search_query, 'en');
	var i = 0; 
	for (var country_code in countries_json)
	{
		grapevine.check_ip_for_country(country_code, function(result1, result2){
			console.log('Test for ' + country_code + ' ' + (result2.valueOf() === result1.valueOf() ? 'PASSED' : 'FAILED ' + result2 + ' ' + result1));
			i++;
			if (i >= Object.keys(countries_json).length)
			{
				grapevine.shutdown(function() { console.log('Done'); });	
			}
		});	
	}
});

