

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