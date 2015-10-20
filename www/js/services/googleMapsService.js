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
            console.log("googleMapsService: start to display trails on google map");
            console.log("googleMapsService: trails are");
            for(var t = 0; t < trails.length; t++){
                console.log("   " + t + ". " + trails[t].IndividualTrail);
            }


            for (var i = 0; i < trails.length; i++){
                console.log("googleMapsService: start to display trail: " + trails[i].IndividualTrail);

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
                console.log("googleMapsService: set title marker map");
                trails[i].title_marker.setMap(google_map);

            }

            console.log("googleMapsService: finished display trails on maps");
        }
        function fitBounds(google_map) {
            google_map.fitBounds(bounds);
        }
        function clearBounds() {
            bounds = new google.maps.LatLngBounds();
        }
        function calculateAndDisplayRoute(start, end, google_map) {
            console.log("googleMapsService: start to calculate and display direction from " +
                "(" + start.lat() + ", " + start.lng() + ") to " +
                "(" + end.lat() + ", " + end.lng() + "), travel mode is driving");
            // pass lat and lng of start and end to display route
            directionsService.route({
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                console.log("googleMapsService: google service of route has responded");
                if (status === google.maps.DirectionsStatus.OK) {
                    console.log("googleMapsService: route respond is OK, next start to display direction on map");
                    directionsDisplay.setMap(google_map);
                    directionsDisplay.setDirections(response);
                } else {
                    console.log("googleMapsService: route respond is " + status + ", it failed.");
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }
        var getGoogleMap = function() {
            console.log("googleMapsService: return map by create a new google map instance with default settings");
          return createAGoogleMap();
        };


        var createAGoogleMap = function() {
            return createAGoogleMap("map");
        };

        var createAGoogleMapByName = function(mapName) {
            var latLng_vic = new google.maps.LatLng(-37, 144);
            console.log("googleMapsService: start to create a new google map instance by settings,");
            console.log("   googleMapsService: center is at (" + latLng_vic.lat() + "," + latLng_vic.lng() + " ), zoom is 7, map type is road map, disable default UI, div id is " + mapName);

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
            console.log("googleMapsService: set style of google map in white and blue");
            map.setOptions({styles: styles});

            console.log("googleMapsService: success to create a new google map instance, and return it");

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

                console.log("googleMapsService: start to calculate distances (in km) from " + des_address + " to trails: ");

                var q = $q.defer();

                var googleDistanceService = new google.maps.DistanceMatrixService;

                var trailLatLng = [];
                for (var i = 0; i < trailLatLngWithName.length; i++){

                    trailLatLng.push(trailLatLngWithName[i].latLng);
                    console.log("   " + i + ". " + trailLatLngWithName.trailName);
                }

                console.log("   search radius is " + distance);

                console.log("googleMapsService: start call google distance matrix service");

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
                            console.log('googleMapsService: Error was: ' + status + ' at get distance of ' + des_address + 'for des-search');
                            q.resolve([]);
                        } else {

                            console.log("googleMapsService: Got responses from google distance matrix service, " + response.originAddresses.length +
                                " results have found. They are ");

                            var resTrailName = [];
                            var originList = response.originAddresses;
                            var destinationList = response.destinationAddresses;
                            destinationAddress = destinationList[0];
                            for (var i = 0; i < originList.length; i++) {
                                var results = response.rows[i].elements;
                                for (var j = 0; j < results.length; j++) {
                                    console.log("   " + i + ". " + trailLatLngWithName.trailName + " has length of " + results[j].distance.value/1000);
                                    if (results[j].distance.value/1000 <= distance){
                                        resTrailName.push(trailLatLngWithName[i]);
                                        console.log("       It length less than search radius " + distance + ", so add into results");
                                    }
                                }
                            }
                            console.log("googleMapsService: distance calculation finished. Results are ");
                            for (var r = 0; r < resTrailName.length; r++){
                                console.log("   " + r + ". " + resTrailName[r].trailName);
                            }
                            q.resolve(resTrailName);
                        }
                    }
                );

                return q.promise;
            },




            getAddressByAddress : function(address){
                console.log("googleMapsService: Start to get address(es) by some key words of " + address);
                var q = $q.defer();

                console.log("google.mapsService: Start to call google geoCoder service");
                var geoCoder = new google.maps.Geocoder();
                geoCoder.geocode(
                    {
                        'address' : address + ' VIC, Australia'
                    },
                    function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            console.log("googleMapsService: Got google geoCoder responds, it is OK");
                            var addresses = [];
                            for (var i = 0; i < results.length; i++) {
                                if (results[i] == "ZERO_RESULTS"){
                                    console.log("   Got zero results of geoCoder");
                                    q.resolve(addresses);
                                    return q.promise;
                                }
                                console.log("   " + i + ". " + results[i].formatted_address);
                                addresses.push(
                                    {
                                        id : addresses.length,
                                        address : results[i].formatted_address
                                    });

                            }
                            q.resolve(addresses);

                        } else {
                            console.log('googleMapsService: Geocode was not successful for the following reason: ' + status);
                        }
                    }
                );

                return q.promise;
            },

            getGeocodeByAddress : function(address) {

                console.log("googleMapsService: Start to get lat and lng by address " + address);

                var q = $q.defer();

                console.log("googleMapsService: Start to call google goeCoder service");
                var geoCoder = new google.maps.Geocoder();
                geoCoder.geocode(
                    {
                        'address' : address
                    },
                    function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            console.log("googleMapsService: Got google geoCoder responds, it is OK");

                            if (results[0] == "ZERO_RESULTS") {
                                console.log("   Got zero results of geoCoder");
                                console.log("   Set result to center of VIC");
                                q.resolve({
                                    H : -37,
                                    L : 144
                                });
                            } else {
                                console.log(" Got the result of lat is " + results[0].geometry.location.lat() + ", lng is " + results[0].geometry.location.lng());
                                q.resolve(results[0].geometry.location);
                            }
                        }
                    }
                );

                return q.promise;
            }


        };



    }]);