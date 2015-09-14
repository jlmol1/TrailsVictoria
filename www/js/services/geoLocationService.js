/**
 * Created by Administrator on 2015/9/14.
 * This service provides getting current location of the user function
 */

trails_app

    .factory('geolocationService', [
        '$q',
        function($q) {
            return {
                getLocation: function(){
                    var q = $q.defer();
                    navigator.geolocation.getCurrentPosition(function(position) {
                        latlng = {
                            'lat': position.coords.latitude,
                            'lng': position.coords.longitude
                        };
                        q.resolve(latlng);
                    }, function(error) {
                        console.log('Got error!');
                        console.log(error);
                        latlng = null;
                        q.reject('Failed to get coordinates of surrent position');
                    });
                    return q.promise;
                }
            };
        }
    ]);