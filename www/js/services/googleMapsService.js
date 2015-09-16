/**
 * Created by jupiterli on 15/09/2015.
 */


trails_app

.factory('googleMapsService', function() {
        // variables
        var google_map;
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;

        // functions
        function calculateAndDisplayRoute(start, end) {
            // pass lat and lng of start and end to display route
            directionsService.route({
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setMap(google_map);
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }
        var getGoogleMap = function() {
          return createAGoogleMap();
        };
        var setGoogleMap = function(new_google_map) {
            google_map = new_google_map;
        };

        var createAGoogleMap = function() {
            var latLng_vic = new google.maps.LatLng(-37, 144);

            var myOptions = {
                zoom: 7,
                center: latLng_vic,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            google_map = new google.maps.Map(
                document.getElementById("map"),
                myOptions
            );
            return google_map;
        };

        return {
            getGoogleMap : getGoogleMap,
            calculateAndDisplayRoute : calculateAndDisplayRoute
        }


    });