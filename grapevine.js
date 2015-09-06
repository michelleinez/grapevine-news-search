//  grapevine setup
var proxysocket = require("proxysocket");


var grapevine = {
	
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
	}
};

module.exports = grapevine;
/*
//grapevine.init();
var socket = proxysocket.create('localhost', 9050);

grapevine.get_json_from_api(
	'maps.googleapis.com',
	'/maps/api/elevation/json?locations=39.7391536,-104.9847034', 
	socket, 
	function(result){
		console.log(result.results);
	});
*/
// example of how to use

/*
grapevine.get_json_from_api(
	'maps.googleapis.com',
	'/maps/api/elevation/json?locations=39.7391536,-104.9847034', 
	socket, 
	function(result){
		console.log(result.results);
	});
*/


