(
	function(){
		var app = angular.module('grapevine', ['ui.bootstrap']);

		app.filter('html', ['$sce', function ($sce) {
		    return function (text) {
		        return $sce.trustAsHtml(text);
		    };
		}]);

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
			var displaySelectionAlert;
			$scope.loaded=false;
			$scope.numChecked=0;
			$scope.news=[];

			socket.on('ack', function (data) {

				$scope.countryClick = function(country) {
					country.checked = !country.checked;
					if(country.checked){
						$scope.numChecked++;
					} else {
						$scope.numChecked--;
					}
					if($scope.numChecked>3){
						$scope.displaySelectionAlert=true;
						country.checked = !country.checked;
						$scope.numChecked--;
					}else{
						$scope.displaySelectionAlert=false;
					}
					updateMarker(country);
					return
				}

				$scope.isChecked = function(country) {
					return country.checked ?  "fa fa-check-square-o" : "fa fa-square-o";
				}

				$scope.columns = function() {
					if($scope.numChecked==1){
						return "col-xs-12";
					} else if($scope.numChecked==2){
						return "col-xs-6";
					} else {
						return "col-xs-4";
					}
				}

				//implements autocomplete for country input
				$scope.updateList = function(countryInput){
					for(country in data){
						if(countryInput==''){
							continue;
						}
						if(data[country]['name'].toLowerCase().indexOf(countryInput.toLowerCase()) !== -1){
							data[country]['display']=true;
						}else{
							data[country]['display']=false;
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
			$scope.displaySearch=true;


			$scope.go = function(query) {
				$scope.displaySearch = false;
				$scope.displaySelectionAlert=false;
				var data = {};
				var userLang = navigator.language || navigator.userLanguage;
				data.search_query = query;
				data.countries = Object.keys(that.countries).filter(function(country){ return that.countries[country].checked; });
				data.user_language = userLang.split('-')[0];

				// FuzzyBuddha it doesn't like this line for some reason?
				//$scope.$apply(function(){ that.news=[]; });
        that.news=[];
				socket.emit('search', data);
			};

			//confused about this part...-Michelle
			$scope.displayLoading = function() {
				return !$scope.displaySearch && !$scope.loaded;
			}

			$scope.titleCase = function(str){
				return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			}

			socket.on('news', function(news) {
				console.log(news);
				$scope.$apply(function(){ that.news.push(news); });
				$scope.loaded = true;
			});

			socket.on('error', function(err){
				console.log("error: " + err);
			});

		});


	}


)();
