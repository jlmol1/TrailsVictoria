/**
 * Created by jupiterli on 8/10/2015.
 */


trails_app.

    controller('DirectionCtrl', function($scope, $stateParams, $window, loadingService, cacheDataService, geolocationService, googleMapsService, $state) {

        var googleDirection = function (trailName){
            loadingService.startLoading();
            var trail = cacheDataService.getTrailsByName(trailName);
            if (trail.length != 1){
                // error occurs, more than one trail matched or no trail matched
                // both are not allowed
                // some error msg must be shown
                return;
            }
            geolocationService.getLocation().then(function(result) {
                var start = new google.maps.LatLng(result.lat, result.lng);
                var end = trail[0].google_poly[0].getPath().getAt(0);
                googleMapsService.calculateAndDisplayRoute(start, end, cacheDataService.getMap());
                loadingService.finishLoading();
            });

        };


        $scope.back = function() {
            //$window.history.back();
            $state.go("tab.display_map");
        };

        $scope.name = $stateParams.trail_name;
        $scope.caller_name = $stateParams.caller_name;
        console.log("DirectionCtrl: direction start, trail_name is ", $scope.name);
        $("#" + $scope.name).hide();
        googleDirection($scope.name);
        $scope.back();


    });