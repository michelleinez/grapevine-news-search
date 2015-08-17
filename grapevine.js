//  grapevine setup
var proxysocket = require("proxysocket");
var base_socks_port=9050;
var sockets = {};
var country_codes = ["be","pl","ca","za","vn","uz","ua","tw","tr","th","sk", 
    "sg","se","sd","sa","ru","ro","pt","ph","pa","nz","np","no","my","mx", 
    "md","lv","lu","kr","jp","it","ir","il","ie","id","hr","hk","gr","gi", 
    "gb","fi","es","ee","dk","cz","cy","cr","co","cn","cl","ci","ch","by", 
    "br","bg","au","at","ar","aq","ao","ae","nl","de","fr"];

for (var i = 0; i < country_codes.length; i++)
{
	sockets[country_codes[i]] = proxysocket.create("localhost", base_socks_port + 1 + i);
}


function get_json_from_api(host, path, socket, callback)
{
	if (socket === undefined)
	{
		console.log('socket was undefined');
		return;
	}

	var response_string = '';

	socket.on('data', function (data) {
		response_string += data;
	    // Receive data
	});

	socket.on('end', function(){
		var json_string = response_string.replace(/(\n|.|\r)*?(?={)/m, '');
	 	var json = JSON.parse(json_string);
	 	callback(json);
	});

	socket.connect(host, 80, function () {
	    console.log('connected');
		socket.write('GET ' + path + ' HTTP/1.0\n\n');
	    // Connected
	});
}

// example of how to use

/*
get_json_from_api(
	'maps.googleapis.com',
	'/maps/api/elevation/json?locations=39.7391536,-104.9847034', 
	socket, 
	function(result){
		console.log(result.results);
	});
*/


