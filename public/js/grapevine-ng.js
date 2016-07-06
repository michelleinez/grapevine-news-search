(
	function() {
		var app = angular.module('grapevine', ['ui.bootstrap']);

		app.directive('ngEnter', function() {
			return function(scope, element, attrs) {
				element.bind("keydown keypress", function(event) {
					if (event.which === 13) {
						scope.$apply(function() {
							scope.$eval(attrs.ngEnter, {
								'event': event
							});
						});

						event.preventDefault();
					}
				});
			};
		});

		app.filter('html', ['$sce', function($sce) {
			return function(text) {
				return $sce.trustAsHtml(text);
			};
		}]);

		app.controller('SocketController', function($scope) {

			// create a map in the "map" div, set the view to a given place and zoom
			var map = L.map('map', {
				layers: [
					L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
						maxZoom: 5,
						minZoom: 1,
						id: 'chinbule.niakl76o',
						accessToken: 'pk.eyJ1IjoiY2hpbmJ1bGUiLCJhIjoiMzY0Y2JlZDI1NGIwYzRhOTkxNGUzNGQzMDZjOTdlYWMifQ.ER66l7Pjj1PI1lVTkSrmJQ'
					})
				],
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
				iconAnchor: [8, 8]
			});

			var selectedMarkerIcon = L.icon({
				iconUrl: 'img/marker-icon-red.png',
				iconAnchor: [8, 8]
			});

			//on click, update map with appropriate pin color for selected/unselected countries
			function updateMarker(country) {
				if (country.checked == true) {
					country['marker'].options.zIndexOffset = 1000;
					country['marker'].options.title = country['name'];
					country['marker'].setIcon(selectedMarkerIcon);
				} else {
					//remove marker
					country['marker'].options.zIndexOffset = 0;
					country['marker'].setIcon(selectedMarkerIcon);
					country['marker'].setIcon(markerIcon);
				}
			}

			var socket = io.connect('http://' + self.location.host);
			//$scope.socket=socket;
			var that = this;

			function resetNewsObjects() {
				that.news = {};
				$scope.nextStoryIndex = {};
			}

			$scope.loaded = false;
			$scope.numChecked = 0;
			that.countries = {};
			resetNewsObjects();

			socket.on('ack', function(data) {

				$scope.countryClick = function(country) {
					country.checked = !country.checked;
					if (country.checked) {
						$scope.numChecked++;
					} else {
						$scope.numChecked--;
					}
					if ($scope.numChecked > 3) {
						$scope.displaySelectionAlert = true;
						country.checked = !country.checked;
						$scope.numChecked--;
					} else {
						$scope.displaySelectionAlert = false;
					}
					if ($scope.numChecked < 1) {
						$scope.displaySearch = true;
					}
					updateMarker(country);
					return;
				}

				$scope.isChecked = function(country) {
					return country.checked ? "fa fa-check-square-o" : "fa fa-square-o";
				}

				$scope.columns = function() {
					if ($scope.numChecked == 1) {
						return "col-xs-12";
					} else if ($scope.numChecked == 2) {
						return "col-xs-6";
					} else {
						return "col-xs-4";
					}
				}

				//implements autocomplete for country input
				$scope.updateList = function(countryInput) {
					for (country in data) {
						if (countryInput == '') {
							continue;
						}
						if (data[country]['name'].toLowerCase().indexOf(countryInput.toLowerCase()) !== -1) {
							data[country]['display'] = true;
						} else {
							data[country]['display'] = false;
						}
					}
				}

				$scope.$apply(function() {
					that.countries = data;
				});

				//pin all of the countries on the map
				for (country in that.countries) {
					that.countries[country]['marker'] = L.marker([that.countries[country].latitude, that.countries[country].longitude], {
						icon: markerIcon,
						title: that.countries[country]['name']
					});
					var options = {
						offset: new L.Point(2, 10),
						closeButton: false
					}
					that.countries[country]['popup'] = new L.Popup();
					that.countries[country]['popup'].setContent(that.countries[country]['name']);
					that.countries[country]['marker'].bindPopup(that.countries[country]['popup'], options).openPopup();
					map.addLayer(that.countries[country]['marker']);
				}
			});
			$scope.displaySearch = true;


			$scope.go = function(query, country_code) {
				$scope.displaySearch = false;
				$scope.displaySelectionAlert = false;
				var data = {};
				var userLang = navigator.language || navigator.userLanguage;
				data.search_query = query;

				// this is triggered only by "more news"
				if (country_code) {
					data.countries = [country_code];
				// else it was a new query
				} else {
					data.countries = Object.keys(that.countries).filter(function(country) {
						return that.countries[country].checked;
					});
					// reset news objects
					resetNewsObjects();
				}
				// get the user's browser language
				data.user_language = userLang.split('-')[0];

				// 
				for (var countryCode in data.countries) {
					var country = data.countries[countryCode];
					if (!$scope.nextStoryIndex.hasOwnProperty(country)) {
						$scope.nextStoryIndex[country] = 0;
					}
					if (!that.news.hasOwnProperty(country)) {
						that.news[country] = [];
					}
				}
				data.result_start = $scope.nextStoryIndex;

				socket.emit('search', data);
			};

			//confused about this part...-Michelle
			$scope.displayLoading = function() {
				return !$scope.displaySearch && !$scope.loaded;
			}

			$scope.titleCase = function(str) {
				if (str) {
					return str.replace(/\w\S*/g, function(txt) {
						return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
					});
				}
			}

			socket.on('news', function(news) {
				var country_code = news['country_code'];
				that.news[country_code] = that.news[country_code].concat(news['news']);
				$scope.nextStoryIndex[country_code] += 8;
				if ($scope.nextStoryIndex[country_code] > 56) {
					$scope.nextStoryIndex[country_code] = 56;
				}
				$scope.$apply();
				$scope.loaded = true;
			});

			socket.on('error', function(err) {
				console.log("error: " + err);
			});
		});


	}


)();
