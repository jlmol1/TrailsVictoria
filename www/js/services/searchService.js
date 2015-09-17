/**
 * Created by Administrator on 2015/9/14.
 * This service is responsible for searching function and hold some search conditions.
 * A problem is that for now it messes up with cache data service. Next step will split the
 *  functions with cache data service.
 */


trails_app

    .factory('searchService', [function() {
        var distance, time, difficulty, activities;

        var IsPrecise, allowance_dis_diff, allowance_diff_time, MIN_LENGTH;

        var name;

        var act;

        // for options are search by name(name), search by activities(act), search by multiple conditions(mul)
        var search_option = "mul";

        // functions
        var searchOnDestination = function (google_map, des_address, googleMapsService, cacheDataService, loadingService) {
            // distance from des to trails, should be defined by user,
            //  temporary using
            var distance = 500;

            // the reason why trails LatLng with name divided to several parts
            // is because google map api only allow 70 arguments max
            var trailsLatLngWithName = cacheDataService.getAllTrailsLatLngWithTrailName();

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


            cacheDataService.setMap(google_map);
            googleMapsService.clearBounds();
            cacheDataService.clearRes();
            for (i = 0; i < separatedTrailsLatLngWithName.length; i++) {
                loadingService.startLoading();
                googleMapsService.getDistancesFromDestination(des_address, separatedTrailsLatLngWithName[i], distance, cacheDataService).then(function(result) {
                    for (var i = 0; i < result.length; i++){
                        var resTrails = cacheDataService.getTrailsByName(result[i].trailName);
                        cacheDataService.load_data(resTrails[0]);
                        googleMapsService.dispalyTrailsOnGoogleMap(resTrails, google_map);
                        cacheDataService.addRes(resTrails[0]);
                    }
                    googleMapsService.fitBounds(google_map);
                    $('#address').val(googleMapsService.getDestinationAdress());
                    loadingService.finishLoading();
                });
            }

            googleMapsService.clearBounds();

        };

        return {
            searchOnDestination : searchOnDestination,
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
                        CacheData.getAndDisplayTrailsByConditions(distance, difficulty, activities, time,
                            IsPrecise, allowance_dis_diff, allowance_diff_time, MIN_LENGTH,
                            GeolocationService, loading);
                        return "Search Results";
                        break;
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
                        CacheData.getAndDisplayTrailsByConditions(distance, difficulty, activities, time,
                            IsPrecise, allowance_dis_diff, allowance_diff_time, MIN_LENGTH,
                            GeolocationService, loading);
                        return "Search Results";
                }
            }

        }
    }]);