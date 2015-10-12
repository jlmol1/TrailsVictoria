/**
 * Created by Administrator on 2015/9/14.
 * This service is responsible for searching function and hold some search conditions.
 * A problem is that for now it messes up with cache data service. Next step will split the
 *  functions with cache data service.
 */


trails_app

    .factory('searchService', ['$q', function($q) {
        var distance, time, difficulty, activities;

        var isPrecise, allowance_dis_diff, allowance_diff_time, MIN_LENGTH;

        // used for combine distance, time, difficulty, activities together
        var mulSearchConditions;

        var name;

        var act;

        // for options are search by name(name), search by activities(act), search by multiple conditions(mul)
        var search_option = "mul";

        // functions
        function getStraightLineDistance(loc1, loc2) {
            // 1 degree latitude is 111km
            return Math.sqrt(Math.pow((loc1.lat() - loc2.lat()), 2) + Math.pow((loc1.lng() - loc2.lng()), 2)) * 111;
        }

        var getTrailsNearCurrentLocation = function (geoLocationService, googleMapsService, cacheDataService, searchRadius, maxNumTrailsDisplay){
            var q = $q.defer();
            var resTrails = [];
            geoLocationService.getLocation().then(function(position){
                var currLatLng = new google.maps.LatLng(position.lat, position.lng);
                var trailsLatLngWithName = cacheDataService.getAllTrailsLatLngWithTrailName();

                googleMapsService.getDistancesFromDestination(currLatLng, trailsLatLngWithName, searchRadius, cacheDataService).then(function(results){
                    for (var i = 0; i < results.length; i++){
                        if (i == maxNumTrailsDisplay){
                            break;
                        }
                        resTrails.push(results[i].trailName);
                    }
                    q.resolve(resTrails);
                });
            });
            return q.promise;
        };

        /**
         * Algorithm
         *  1. reduce number of trail before search distance using google service
         *   1.1 get all trails with its name and lat and lng
         *   1.2 use a trial's location and destination location to calculate
         *      straight line distance
         *   1.3 only choose some trails that has a little distance
         *  2. use results of above to continue calculate by using google service
         */
        var searchOnDestination = function (google_map, des_address, googleMapsService, cacheDataService, loadingService, searchRadius, overlappingMarkerSpiderfyService, $scope, $compile) {

            console.log("SearchService: search on destination start on des ", des_address);

            // get trails with name and lat and lng
            var trailsLatLngWithName = cacheDataService.getAllTrailsLatLngWithTrailName();

            // get des location, lat lng
            loadingService.startLoading();
            googleMapsService.getGeocodeByAddress(des_address).then(function(result) {
                var matchedTrails = [];
                for (var i = 0; i < trailsLatLngWithName.length; i++) {
                    // if straight line distance is not less than search radius,
                    //  then its actual distance must be greater than search radius
                    if (getStraightLineDistance(trailsLatLngWithName[i].latLng, result) <= searchRadius){
                        matchedTrails.push(trailsLatLngWithName[i]);
                    }
                }

                // some actions must be done if it is still exceed limit
                //  this is not a good way
                if (matchedTrails.length > 25){
                    matchedTrails.length = 25;
                }

                cacheDataService.setMap(google_map);
                googleMapsService.clearBounds();
                cacheDataService.clearRes();


                googleMapsService.getDistancesFromDestination(des_address, matchedTrails, searchRadius, cacheDataService).then(function(result) {
                    if (result.length > 0){
                        for (var i = 0; i < result.length; i++){
                            var resTrails = cacheDataService.getTrailsByName(result[i].trailName);
                            cacheDataService.load_data(resTrails[0]);
                            googleMapsService.dispalyTrailsOnGoogleMap(resTrails, google_map);
                            cacheDataService.addRes(resTrails[0]);
                        }
                        googleMapsService.fitBounds(google_map);
                        $('#address').val(googleMapsService.getDestinationAdress());

                        // add listener for spiderfying
                        overlappingMarkerSpiderfyService.clear();
                        overlappingMarkerSpiderfyService.initial(google_map, cacheDataService.getAllMarkers(), new google.maps.InfoWindow(), $scope, $compile);


                        loadingService.finishLoading();
                    } else{
                        loadingService.finishLoading();
                        alert("Nothing found");
                    }

                });


                googleMapsService.clearBounds();
            });




        };

        return {
            searchOnDestination : searchOnDestination,
            getTrailsNearCurrentLocation : getTrailsNearCurrentLocation,
            getMulSearchConditions : function() {
              return mulSearchConditions;
            },
            setMulSearchConditions : function (vaule) {
              mulSearchConditions = vaule;
            },
            setIsPrecise : function(value) {
                isPrecise = value;
            },
            getDistance : function() {
                return distance;
            },
            setDistance : function(dis) {
                distance = dis;
            },
            getTime : function(){
                return time;
            },
            setTime : function(ti) {
                time = ti;
            },
            getDifficulty : function(){
                return difficulty;
            },
            setDifficulty : function (dif) {
                difficulty = dif;
            },
            getActivities : function() {
                return activities;
            },
            setActivities : function(act){
                activities = act;
            },
            getSearchOption : function(){
                return search_option;
            },
            setSearchOption : function(option) {
                search_option = option;
            },
            getName : function() {
                return name;
            },
            setName : function (na) {
                name = na;
            },
            getAct : function() {
                return act;
            },
            setAct : function(a) {
                act = a;
            },
            doSearch : function (CacheData, GeolocationService, loading, overlappingMarkerSpiderfyService, MarkerClustererService, $scope, $compile) {
                switch (search_option) {
                    case "mul":
                        return CacheData.getAndDisplayTrailsByConditions(mulSearchConditions,
                            isPrecise, MIN_LENGTH,
                            GeolocationService, loading, overlappingMarkerSpiderfyService, MarkerClustererService, $scope, $compile);


                    case "name" :
                        if (CacheData.getAndDisplayTrailsByName(name, loading, overlappingMarkerSpiderfyService, $scope, $compile)) {
                            return name;
                        } else {
                            return "Nothing found";
                        }
                        break;
                    case "act" :
                        if (CacheData.getAndDisplayTrailsByAct(act, loading)) {
                            return act;
                        } else {
                            return "Nothing found";
                        }
                        break;
                    default :
                        return CacheData.getAndDisplayTrailsByConditions(mulSearchConditions,
                            isPrecise, MIN_LENGTH,
                            GeolocationService, loading, overlappingMarkerSpiderfyService, MarkerClustererService, $scope, $compile);

                }
            }

        }
    }]);