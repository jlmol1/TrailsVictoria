/**
 * Created by jupiterli on 11/10/2015.
 */


trails_app

.controller('googleInfoWindowCtrl', function($scope,
                                             loadingService,
                                             cacheDataService,
                                             geolocationService,
                                             googleMapsService) {

        //functions
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

        $scope.directMe = function(trail_name) {
            console.log("googleInfoWindowCtrl: direct me button clicked, trail name is " + trail_name);
            googleDirection(trail_name);
        }


    });