(function () {
    'use strict';

    angular.module('wheresMyCarApp').controller('HomeCtrl', ['$scope','$location','$ionicLoading','findItService',HomeCtrl]);

    function HomeCtrl($scope, $location,$ionicLoading,findItService) {
        var vm = this;

        vm.NavigateToCar = function() {
            findItService.findParkedCar();
        }

        vm.GoToMapView = function() {
        	$location.path('/app/map');
        };

        vm.isCarParked = function() {
        	vm.car = findItService.getParkedCar();
        	return (vm.car != null);
        };

        vm.ParkMyCar = function() {
            $ionicLoading.show({
                template: 'Determining Location...'
            });

            findItService.parkMyCar().then(function(data) {
                
            },
            function(reason) {
                console.log("Error: " + reason);
            })
            .finally(function() {
                console.log("Finished with ParkMyCar");
                $ionicLoading.hide();
            });
        };

        vm.UnparkMyCar = function() {
        	findItService.unParkMyCar();
        };

        var init = function() {
        	vm.isCarParked();
        };

        init();
    };
})();