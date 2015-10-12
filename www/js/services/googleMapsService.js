/**
 * Created by jupiterli on 15/09/2015.
 */


trails_app

.factory('googleMapsService', ['$q', function($q) {
        // variables
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var destinationAddress = "";
        // store bounds for all matched trails
        var bounds = new google.maps.LatLngBounds();


        // functions
        function dispalyTrailsOnGoogleMap(trails, google_map) {

            for (var i = 0; i < trails.length; i++){


                for (var j = 0; j < trails[i].google_poly.length; j++){
                    trails[i].google_poly[j].setMap(google_map);

                    trails[i].google_poly[j].getPath().forEach(function(latLng) {
                        bounds.extend(latLng);
                    });
                }

                // display markers when zoom in at a certain level
                //for (var j = 0; j < trails_to_displayed[i].markers.length; j++){
                //  trails_to_displayed[i].markers[j].setMap(map);
                //}
                trails[i].title_marker.setMap(google_map);

            }

        }
        function fitBounds(google_map) {
            google_map.fitBounds(bounds);
        }
        function clearBounds() {
            bounds = new google.maps.LatLngBounds();
        }
        function calculateAndDisplayRoute(start, end, google_map) {
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


        var createAGoogleMap = function() {
            var latLng_vic = new google.maps.LatLng(-37, 144);

            var myOptions = {
                zoom: 7,
                center: latLng_vic,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };

            google_map = new google.maps.Map(
                document.getElementById("map"),
                myOptions
            );
            return google_map;
        };

        var createAGoogleMapByName = function(mapName) {
            var latLng_vic = new google.maps.LatLng(-37, 144);

            var myOptions = {
                zoom: 7,
                center: latLng_vic,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(
                document.getElementById(mapName),
                myOptions
            );

            var styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]

            map.setOptions({styles: styles});

            return map;
        };

        return {
            getGoogleMap : getGoogleMap,
            calculateAndDisplayRoute : calculateAndDisplayRoute,
            createAGoogleMapByName : createAGoogleMapByName,
            dispalyTrailsOnGoogleMap : dispalyTrailsOnGoogleMap,
            clearBounds : clearBounds,
            fitBounds : fitBounds,

            getDestinationAdress : function() {
              return destinationAddress;
            },

            getDistancesFromDestination : function (des_address, trailLatLngWithName , distance) {
                var q = $q.defer();

                var googleDistanceService = new google.maps.DistanceMatrixService;

                var trailLatLng = [];
                for (var i = 0; i < trailLatLngWithName.length; i++){

                    trailLatLng.push(trailLatLngWithName[i].latLng);
                }

                googleDistanceService.getDistanceMatrix(
                    {
                        origins:  trailLatLng,
                        destinations: [des_address],
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: true
                    },
                    /**
                     * return trail names which matched
                     * */
                    function (response, status){
                        if (status !== google.maps.DistanceMatrixStatus.OK) {
                            console.log('Error was: ' + status + ' at get distance of ' + des_address + 'for des-search');
                            q.resolve([]);
                        } else {
                            var resTrailName = [];
                            var originList = response.originAddresses;
                            var destinationList = response.destinationAddresses;
                            destinationAddress = destinationList[0];
                            for (var i = 0; i < originList.length; i++) {
                                var results = response.rows[i].elements;
                                for (var j = 0; j < results.length; j++) {

                                    if (results[j].distance.value/1000 <= distance){
                                        resTrailName.push(trailLatLngWithName[i]);
                                    }
                                }
                            }

                            q.resolve(resTrailName);
                        }
                    }
                );

                return q.promise;
            },




            getAddressByAddress : function(address){
                var q = $q.defer();

                var geoCoder = new google.maps.Geocoder();
                geoCoder.geocode(
                    {
                        'address' : address + ' VIC, Australia'
                    },
                    function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            var addresses = [];
                            for (var i = 0; i < results.length; i++) {
                                if (results[i] == "ZERO_RESULTS"){
                                    q.resolve(addresses);
                                    return q.promise;
                                }
                                addresses.push(
                                    {
                                        id : addresses.length,
                                        address : results[i].formatted_address
                                    });

                            }
                            q.resolve(addresses);

                        } else {
                            console.log('Geocode was not successful for the following reason: ' + status);
                        }
                    }
                );

                return q.promise;
            },

            getGeocodeByAddress : function(address) {
                var q = $q.defer();

                var geoCoder = new google.maps.Geocoder();
                geoCoder.geocode(
                    {
                        'address' : address
                    },
                    function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            if (results[0] == "ZERO_RESULTS") {
                                q.resolve({
                                    H : -37,
                                    L : 144
                                });
                            } else {
                                q.resolve(results[0].geometry.location);
                            }
                        }
                    }
                );

                return q.promise;
            }


        };



    }]);