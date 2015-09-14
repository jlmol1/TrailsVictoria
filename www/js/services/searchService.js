/**
 * Created by Administrator on 2015/9/14.
 * This service is responsible for searching function and hold some search conditions.
 * A problem is that for now it messes up with cache data service. Next step will split the
 *  functions with cache data service.
 */


trails_app

    .factory('searchService', function() {
        var distance, time, difficulty, activities;

        var IsPrecise, allowance_dis_diff, allowance_diff_time, MIN_LENGTH;

        var name;

        var act;

        // for options are search by name, search by activities, search by multiple conditions
        var search_option = "mul";

        return {
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
    });