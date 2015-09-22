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

        var name;

        var act;

        // for options are search by name(name), search by activities(act), search by multiple conditions(mul)
        var search_option = "mul";

        // functions
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

        var searchOnDestination = function (google_map, des_address, googleMapsService, cacheDataService, loadingService, searchRadius) {

            // the reason why trails LatLng with name divided to several parts
            // is because arguments exceed google map api limitation
            var trailsLatLngWithName = cacheDataService.getAllTrailsLatLngWithTrailName();



            cacheDataService.setMap(google_map);
            googleMapsService.clearBounds();
            cacheDataService.clearRes();
                loadingService.startLoading();

                googleMapsService.getDistancesFromDestination(des_address, trailsLatLngWithName, searchRadius, cacheDataService).then(function(result) {
                    if (result.length > 0){
                        for (var i = 0; i < result.length; i++){
                            var resTrails = cacheDataService.getTrailsByName(result[i].trailName);
                            cacheDataService.load_data(resTrails[0]);
                            googleMapsService.dispalyTrailsOnGoogleMap(resTrails, google_map);
                            cacheDataService.addRes(resTrails[0]);
                        }
                        googleMapsService.fitBounds(google_map);
                        $('#address').val(googleMapsService.getDestinationAdress());
                        loadingService.finishLoading();
                    } else{
                        loadingService.finishLoading();
                        alert("Nothing found");
                    }

                });


            googleMapsService.clearBounds();

        };

        return {
            searchOnDestination : searchOnDestination,
            getTrailsNearCurrentLocation : getTrailsNearCurrentLocation,
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
            doSearch : function (CacheData, GeolocationService, loading) {
                switch (search_option) {
                    case "mul":
                        return CacheData.getAndDisplayTrailsByConditions(distance, difficulty, activities, time,
                            isPrecise, allowance_dis_diff, allowance_diff_time, MIN_LENGTH,
                            GeolocationService, loading);


                    case "name" :
                        if (CacheData.getAndDisplayTrailsByName(name, loading)) {
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
                        return CacheData.getAndDisplayTrailsByConditions(distance, difficulty, activities, time,
                            isPrecise, allowance_dis_diff, allowance_diff_time, MIN_LENGTH,
                            GeolocationService, loading);

                }
            }

        }
    }]);