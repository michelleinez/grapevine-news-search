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
