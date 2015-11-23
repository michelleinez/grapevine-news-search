(
	function(){
		var app = angular.module('grapevine', ['ui.bootstrap']);


		app.controller('SocketController', function($scope){

			//initialize the map
			var map = L.map('map', {
			    center: [51.505, -0.09],
			    zoom: 1
			});

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			    maxZoom: 18,
			    id: 'chinbule.niakl76o',
			    accessToken: 'pk.eyJ1IjoiY2hpbmJ1bGUiLCJhIjoiMzY0Y2JlZDI1NGIwYzRhOTkxNGUzNGQzMDZjOTdlYWMifQ.ER66l7Pjj1PI1lVTkSrmJQ'
			}).addTo(map);

			var markerIcon = L.icon({
			    iconUrl: 'img/marker-icon.png',
			    iconAnchor:   [12, 40]
			});

			

			var socket = io.connect('http://127.0.0.1:8081');
			//$scope.socket=socket;
			var that = this;

			socket.on('ack', function (data) {
				console.log(data);

				$scope.isPinned = function(country) {
					return country.checked ?  "pin" : "no-pin";
				}
				$scope.isChecked = function(country) {
					updateMarker(country);
					return country.checked ?  "fa fa-check-square-o" : "fa fa-square-o";
				}


				

/*
				socket.emit('search', 'gorilla attacks');
				var country_data = {countries:['us', 'fr']};
				socket.emit('countries', JSON.stringify(country_data));
				socket.on('news', function(data) {
					console.log('news received');
					var country_code = data.country_code;
					var news = data.news;
					var news_item = '<a href=' + news[0].url + '>' +news[0].title + '<br>' + news[0].summary +'</a><br><img src=' + news[0].imageUrl + '>';
					if (country_code == 'us')
					{
						$('#country_0').html(news_item);
					}
					else
					{
						$('#country_1').html(news_item);			
					}
				});
*/
				socket.on('error', function(err){
					console.log("error: " + err);
				});
				$scope.$apply(function(){that.countries = data;});

				//create a marker for each checked country
				L.marker([-10.3333333, -53.2], {icon: markerIcon}).addTo(map);
				
				Object.keys(that.countries).forEach(function (key) {
				    var country = that.countries[key];
					updateMarker(country);
				});

				
				
				function updateMarker(country){
					if(country.checked==true){
						console.log('updateMarker country=',country);
						country['marker']=L.marker([country.latitude, country.longitude], {icon: markerIcon})
						map.addLayer(country['marker']);
						console.log('marker!= ',country['marker'])
					} else {
						//remove marker
						console.log('updateMarker country=',country);
					    map.removeLayer(country['marker']);
					    console.log('marker!= ',country['marker'])
					}
				}

				console.log(Object.getOwnPropertyNames(that.countries));
				
				


			});
	
		});
	}
)();