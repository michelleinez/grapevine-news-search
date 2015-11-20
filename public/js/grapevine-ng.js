(
	function(){
		var app = angular.module('grapevine', ['ui.bootstrap']);


		app.controller('SocketController', function($scope){
			var socket = io.connect('http://127.0.0.1:8081');
			$scope.socket=socket;
			socket.on('ack', function (data) {

				$scope.countries = data;
				for(cc in $scope.countries){
					console.log($scope.countries[cc].name);
				}
				
				console.log($scope.countries);
				$scope.isPinned = function(country) {
					return country.checked ?  "pin" : "no-pin";
				}
				$scope.isChecked = function(country) {
					return country.checked ?  "fa fa-check-square-o" : "fa fa-square-o";
				}

				//console.log(countries);
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
			});

		});
	}
)();