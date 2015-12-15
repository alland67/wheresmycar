(function () {
    'use strict';

    angular.module('wheresMyCarApp').factory('findItService', ['$window', '$q','$http', '$cordovaGeolocation','$cordovaLaunchNavigator',findItService]);

    function findItService($window, $q, $http, $cordovaGeolocation, $cordovaLaunchNavigator) {

    	function parkMyCar() {
    		//Generate gps location
    		//Get time
    		//Populate myCar object
    		//Store myCar object
    		var myCar = {
                    lat:0.0,
                    lon:0.0,
                    address:""
            };

            var deferred = $q.defer();

    		var posOptions = {
            	enableHighAccuracy: true,
            	timeout: 20000,
            	maximumAge: 0
        	};

        	ionic.Platform.ready(function() {

            	$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                	myCar.lat  = position.coords.latitude;
                	myCar.lon  = position.coords.longitude;

                    return myCar;

                })
                .then (function(myCar) {
                    var latlng = {lat: parseFloat(myCar.lat), lng: parseFloat(myCar.lon)};

                    return latlng;

                })   
                .then (function(latlng) {
                    var mapUrl = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng.lat+','+latlng.lng+'&sensor=true';
                    
                    return $http.get(mapUrl);

                })
                .then (function(results) {
                    console.log("Coordinates have been found.");
                    myCar.address = results.data.results[0].formatted_address;

                    $window.localStorage['myCarKey'] = JSON.stringify(myCar);

                    deferred.resolve(myCar);
                }, 
                    function(err) {
                        coordsonsole.log(err);
                    }
                );    
        	});

            return deferred.promise;
    	}

    	function getParkedCar() {
    		var parkedCar 	= null;
    		var isFound 	= $window.localStorage['myCarKey'];

    		if (isFound && isFound != "undefined") {
    			parkedCar = JSON.parse(isFound);
    		}

    		return parkedCar;

    	}

    	function unParkMyCar() {
    		$window.localStorage['myCarKey'] = null;
    	}

        function findParkedCar() {
            var myCar = getParkedCar();

            ionic.Platform.ready(function() {
                var destination = [myCar.lat, myCar.lon];
                var start = null;
                $cordovaLaunchNavigator.navigate(destination, start).then(function() {
                    console.log("Navigator launched");
                }, function (err) {
                    console.error(err);
                });
            })
        }

    	return {
            parkMyCar: parkMyCar,
            unParkMyCar: unParkMyCar,
            getParkedCar: getParkedCar,
            findParkedCar: findParkedCar
    	};
	};
})();