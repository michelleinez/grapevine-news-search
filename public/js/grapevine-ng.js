(
	function(){
		var app = angular.module('grapevine', ['ui.bootstrap']);


		app.controller('SocketController', function($scope){

			// create a map in the "map" div, set the view to a given place and zoom
			var map = L.map('map', {
			    layers: [
			    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			    maxZoom: 5,
			    minZoom: 1,
			    id: 'chinbule.niakl76o',
			    accessToken: 'pk.eyJ1IjoiY2hpbmJ1bGUiLCJhIjoiMzY0Y2JlZDI1NGIwYzRhOTkxNGUzNGQzMDZjOTdlYWMifQ.ER66l7Pjj1PI1lVTkSrmJQ'
			})],
			    zoom: 1,
			    center: [49.009952, 2.548635],
			    //        maxBounds: [[-90.0,-180.0],[90.0,180.0]]
			    maxBounds: [
			        [-85.0, -180.0],
			        [85.0, 180.0]
			    ]

			});

			var markerIcon = L.icon({
			    iconUrl: 'img/marker-icon-red2.png',
			    iconAnchor:   [8, 8]
			});

			var selectedMarkerIcon = L.icon({
			    iconUrl: 'img/marker-icon-red.png',
			    iconAnchor:   [8, 8]
			});

				//on click, update map with appropriate pin color for selected/unselected countries
			function updateMarker(country){
				if(country.checked==true){
					country['marker'].options.zIndexOffset=1000;
					country['marker'].options.title=country['name'];
					country['marker'].setIcon(selectedMarkerIcon);
				} else {
					//remove marker
					country['marker'].options.zIndexOffset=0;
					country['marker'].setIcon(selectedMarkerIcon);
					country['marker'].setIcon(markerIcon);
				}
			}


			

			var socket = io.connect('http://127.0.0.1:8081');
			//$scope.socket=socket;
			var that = this;

			socket.on('ack', function (data) {
				console.log(data);

				$scope.countryClick = function(country) {
					country.checked = !country.checked;
					updateMarker(country);
					return
				}

				$scope.isChecked = function(country) {
					return country.checked ?  "fa fa-check-square-o" : "fa fa-square-o";
				}

				//doesnt work yet...supposed to update country list to implement autocomplete of input
				$scope.updateList = function(countryInput){
					console.log("meep");
					for(country in data){
						if(countryInput==''){
							console.log('blank input');
							continue;
						}
						if(data[country]['name'].toLowerCase().indexOf(countryInput.toLowerCase()) !== -1){
							console.log('country',data[country]['name'].toLowerCase());
							console.log(countryInput);
							data[country]['display']=true;
							console.log(data[country]['display']);
						}else{
							console.log('country',data[country]['name'].toLowerCase());
							data[country]['display']=false;
							console.log(data[country]['display']);
						}
					}
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

				$scope.$apply(function(){ that.countries = data; });
				
				//pin all of the countries on the map
				for(country in that.countries){
					console.log(that.countries[country]);
					that.countries[country]['marker'] = L.marker([that.countries[country].latitude, that.countries[country].longitude], {icon: markerIcon, title: that.countries[country]['name']});
					var options = {
						  offset:  new L.Point(2, 10),
						  closeButton: false
						}
						that.countries[country]['popup']=new L.Popup();
						that.countries[country]['popup'].setContent(that.countries[country]['name']);
						that.countries[country]['marker'].bindPopup(that.countries[country]['popup'], options).openPopup();
						map.addLayer(that.countries[country]['marker']);
				}
			});
	
			$scope.go = function(query) {
				var data = {};
				data.search_query = query;
				data.countries = Object.keys(that.countries).filter(function(country){ return that.countries[country].checked; });
				socket.emit('search', data);
			};

			socket.on('news', function(news) {
				// Michelle here's the news
				console.log(news);
			});
			socket.on('error', function(err){
				console.log("error: " + err);
			});

		});


	}


)();