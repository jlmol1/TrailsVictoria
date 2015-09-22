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

            getDistancesFromDestination : function (des_address, trailsLatLngWithName , searchRadius) {
                /**
                 * Bug
                 * since 82 records are already exceed google map api allowance, it has to be separated to
                 *  several parts. Last version(see backup) tried to separate them at this function's caller,
                 *  but caller call this function several times before this function return, then trailsLatLngWithName
                 *  was keep changing, which means may not be the correct data, and search results rely on trailsLatLngWithName.
                 *  Must find a way to force it wait until previous one finished.
                 *
                 * Since we do not yet find a good solution, here all data will be separated manually, and
                 *  repeating call google service by creating redundant code.
                * */
                var q = $q.defer();

                var googleDistanceService = new google.maps.DistanceMatrixService;

                var separatedTrailsLatLngWithName = [];
                var currentPosition = 0;
                for (var i = 0; i < trailsLatLngWithName.length; i++) {
                    if (i % 25 == 0) {
                        if (i == 0){
                            separatedTrailsLatLngWithName[currentPosition] = [];
                        } else {
                            separatedTrailsLatLngWithName[++currentPosition] = [];
                        }


                    }
                    separatedTrailsLatLngWithName[currentPosition].push(trailsLatLngWithName[i]);
                }


                // collecting results
                var res_trails = [];

                // start searching, totally 4 intervals
                var trailsLatLng = [[], [], [], []];

                // 1st interval
                    for (var y = 0; y < separatedTrailsLatLngWithName[0].length; y++){

                        trailsLatLng[0].push((separatedTrailsLatLngWithName[0])[y].latLng);
                    }

                    googleDistanceService.getDistanceMatrix(
                        {
                            origins:  trailsLatLng[0],
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
                            } else {
                                var originList = response.originAddresses;
                                var destinationList = response.destinationAddresses;
                                destinationAddress = destinationList[0];
                                for (var i0 = 0; i0 < originList.length; i0++) {
                                    var results = response.rows[i0].elements;
                                    for (var j0 = 0; j0 < results.length; j0++) {

                                        if (results[j0].distance.value/1000 <= searchRadius){
                                            res_trails.push((separatedTrailsLatLngWithName[0])[i0]);
                                        }
                                    }
                                }
                                q.resolve(res_trails);
                            }
                        }
                    );

                // 2nd interval
                for ( y = 0; y < separatedTrailsLatLngWithName[1].length; y++){

                    trailsLatLng[1].push((separatedTrailsLatLngWithName[1])[y].latLng);
                }

                googleDistanceService.getDistanceMatrix(
                    {
                        origins:  trailsLatLng[1],
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
                        } else {
                            var originList = response.originAddresses;
                            var destinationList = response.destinationAddresses;
                            destinationAddress = destinationList[0];
                            for (var i1 = 0; i1 < originList.length; i1++) {
                                var results = response.rows[i1].elements;
                                for (var j1 = 0; j1 < results.length; j1++) {

                                    if (results[j1].distance.value/1000 <= searchRadius){
                                        res_trails.push((separatedTrailsLatLngWithName[1])[i1]);
                                    }
                                }
                            }
                            q.resolve(res_trails);
                        }
                    }
                );

                // 3rd interval
                for (var y = 0; y < separatedTrailsLatLngWithName[2].length; y++){

                    trailsLatLng[2].push((separatedTrailsLatLngWithName[2])[y].latLng);
                }

                googleDistanceService.getDistanceMatrix(
                    {
                        origins:  trailsLatLng[2],
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
                        } else {
                            var originList = response.originAddresses;
                            var destinationList = response.destinationAddresses;
                            destinationAddress = destinationList[0];
                            for (var i2 = 0; i2 < originList.length; i2++) {
                                var results = response.rows[i2].elements;
                                for (var j2 = 0; j2 < results.length; j2++) {

                                    if (results[j2].distance.value/1000 <= searchRadius){
                                        res_trails.push((separatedTrailsLatLngWithName[2])[i2]);
                                    }
                                }
                            }
                            q.resolve(res_trails);
                        }
                    }
                );

                // 4th interval
                for (var y = 0; y < separatedTrailsLatLngWithName[3].length; y++){

                    trailsLatLng[3].push((separatedTrailsLatLngWithName[3])[y].latLng);
                }

                googleDistanceService.getDistanceMatrix(
                    {
                        origins:  trailsLatLng[3],
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
                        } else {
                            var originList = response.originAddresses;
                            var destinationList = response.destinationAddresses;
                            destinationAddress = destinationList[0];
                            for (var i3 = 0; i3 < originList.length; i3++) {
                                var results = response.rows[i3].elements;
                                for (var j3 = 0; j3 < results.length; j3++) {

                                    if (results[j3].distance.value/1000 <= searchRadius){
                                        res_trails.push((separatedTrailsLatLngWithName[3])[i3]);
                                    }
                                }
                            }
                            q.resolve(res_trails);
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
                        'address' : address + ', Australia'
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
            }


        };



    }]);