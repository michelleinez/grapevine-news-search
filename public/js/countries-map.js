
//initialize the map
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 1
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'chinbule.niakl76o',
    accessToken: 'pk.eyJ1IjoiY2hpbmJ1bGUiLCJhIjoiMzY0Y2JlZDI1NGIwYzRhOTkxNGUzNGQzMDZjOTdlYWMifQ.ER66l7Pjj1PI1lVTkSrmJQ'
}).addTo(map);

// Make the map and country list the same height

/*
function resizeDivs() {
    var map = document.getElementById('map').offsetHeight;
    var countryList = document.getElementById('country_list').offsetHeight;
    if (countryList > map) {
        map = countryList;
        document.getElementById('map').style.height = document.getElementById('country_list').style.height = map + 'px'
    } else {
        countryList = map;
        document.getElementById('country_list').style.height = document.getElementById('map').style.height = countryList + 'px'
    }
}
*/


function resizeDivs() {
	var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	document.getElementById('country_list').style.height = height;
	document.getElementById('map').style.height = height;
}

window.onload = resizeDivs;