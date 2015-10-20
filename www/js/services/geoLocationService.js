/**
 * Created by Administrator on 2015/9/14.
 * This service provides getting current location of the user function
 */

trails_app

    .factory('geolocationService', [
        '$q',
        function($q) {
            return {
                getLocation: function(loadingService){
                    console.log("geolocationService: start get current position.");
                    var q = $q.defer();

                    var latlng;

                    navigator.geolocation.getCurrentPosition(function(position) {
                        console.log("geolocationService: got current position which is (" + position.coords.latitude + ", " + position.coords.longitude + ")");

                        latlng = {
                            'lat': position.coords.latitude,
                            'lng': position.coords.longitude
                        };
                        q.resolve(latlng);
                    }, function(error) {
                        console.log("geolocationService: failed to get current location, error message is " + error);
                        latlng = null;
                        loadingService.finishLoading();
                        alert("Failed to get your current location, make sure your location service is on.");
                        q.reject('Failed to get coordinates');
                    });
                    return q.promise;
                }
            };
        }
    ]);