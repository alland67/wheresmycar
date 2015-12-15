(function () {
    'use strict';

    angular.module('wheresMyCarApp').controller('MapController', ['$scope','$cordovaGeolocation', '$ionicLoading', MapController]);

    function MapController($scope, $cordovaGeolocation, $ionicLoading) {
        var vm = this;

        ionic.Platform.ready(function() {
        	//Place map code here.
        	$ionicLoading.show({
            	template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        	});
         
        	var posOptions = {
            	enableHighAccuracy: true,
            	timeout: 20000,
            	maximumAge: 0
        	};
        	$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            	var lat  = position.coords.latitude;
            	var long = position.coords.longitude;
             
            	var myLatlng = new google.maps.LatLng(lat, long);
             
            	var mapOptions = {
                	center: myLatlng,
                	zoom: 16,
                	mapTypeId: google.maps.MapTypeId.ROADMAP
            	};          
             
            	var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
             
            	$scope.map = map;   
            	$ionicLoading.hide();

            	//Wait until the map is loaded to place the marker
				google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
  					var marker = new google.maps.Marker({
      					map: $scope.map,
      					animation: google.maps.Animation.DROP,
      					position: myLatlng
  					});  

  					  	var infoWindow = new google.maps.InfoWindow({
      						content: "Here I am!"
  						});
 
  						google.maps.event.addListener(marker, 'click', function () {
      						infoWindow.open($scope.map, marker);
  						});    
 
				});           
             
        	}, function(err) {
            	$ionicLoading.hide();
            	coordsonsole.log(err);
        	});
        })
    };
})();