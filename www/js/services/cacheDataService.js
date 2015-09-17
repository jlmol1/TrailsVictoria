/**
 * Created by Administrator on 2015/9/14.
 * Cache Data Service is a complex service, as it is the first service construct
 *  at the very beginning of this application in which moment developers were still
 *  not familiar with angular js, so it is messed up with a lot of functions and some
 *  of them are not suppose in this service. At next step it will be split to several services.
 */

trails_app

    .factory('cacheDataService', function() {

        var map = null;
        /**
         * a collection  of trails and respective markers
         * id is the IndividualTrail
         * sample data structure
         * trails = [
         * {MainTrail: 'name1', IndividualTrail: 'name1', difficulty: 'diff',distance: int, activity: 'act', google_poly: [{google_poly, google_poly}, {google_poly, google_poly}], markers:[
     *    {google_marker: google_marker},
     *    {google_marker: google_marker}
     *    ], title_marker: google_marker, weather_marker: google_marker, max_lat: lat, min_lat: lat, mean_lon: lon},
         * {MainTrail: 'name1', IndividualTrail: 'name2', difficulty: 'diff',distance: int, activity: 'act',google_poly: [{google_poly, google_poly}, {google_poly, google_poly}], markers:[], , title_marker: google_marker, weather_marker: google_marker, max_lat: lat, min_lat: lat, mean_lon: lon}
         * ]
         */
        var trails = [];
        // store current location marker
        var curr_marker = null;
        // store the results of searching by conditions from previous page
        var res = [];
        // store current location's latitude and longitude
        var curr_latLng;
        // store bounds for all matched trails
        var bounds = new google.maps.LatLngBounds();

        // should be deleted
        // for get all symbols in gpx file id: 01
        //var symbols = [];

        // functions
        var getAllTrailsLatLngWithTrailName = function() {
            var latLng = [];

            for (var i = 0; i < trails.length; i++){
                latLng.push(
                    {
                        trailName: trails[i].IndividualTrail,
                        latLng: trails[i].title_marker.getPosition()
                    }
                );
            }

            return latLng;
        };
        var getMarkerIcon = function (markerName) {
            return "img/gpx_icons/" + markerName + ".png";
        };

        var getGpxUrl = function (MainTrail, IndividualTrail){
            return "data/gpx/" + IndividualTrail + ".gpx";
        };

        var getActivitiesIconUrl = function(actName) {
            return "img/activities_icons/" + (actName.toLocaleString().split(","))[0] + ".png";
        };

        var getTrailsByName = function (name) {
            var res_trails = [];
            for (var i = 0; i < trails.length; i++){
                if (trails[i].IndividualTrail.toLocaleLowerCase() === name.toLocaleLowerCase()){
                    res_trails.push(trails[i]);
                }
            }
            return res_trails;
        };

        var getTrailsByActivity = function  (act) {
            var res_trails = [];
            for (var i = 0; i < trails.length; i++){
                var activities = trails[i].activity.split(",");
                for (var j = 0; j < activities.length; j++){
                    if (activities[j].toLocaleLowerCase() === act.toLocaleLowerCase()){
                        res_trails.push(trails[i]);
                        break;
                    }
                }

            }
            return res_trails;
        };


        var load_data = function(trail) {
            $.ajax({
                type: "GET",
                url: "data/gpx/" + trail.IndividualTrail + ".gpx",
                dataType: "xml",
                async: false,
                success: function (xml) {



                    // trails
                    $(xml).find("trk").each(function () {

                        var points = [];


                        // find a trail
                        $(this).find("trkpt").each(function () {
                            var lat = $(this).attr("lat");
                            var lon = $(this).attr("lon");
                            var p = new google.maps.LatLng(lat, lon);
                            points.push(p);
                        });

                        var poly = new google.maps.Polyline({
                            // use your own style here
                            path: points,
                            strokeColor: $(this).find("DisplayColor").text(),
                            strokeOpacity: .7,
                            strokeWeight: 4
                        });
                        //poly.setMap(map);
                        trail.google_poly.push(poly);

                        // markers
                        $(xml).find("wpt").each(function () {
                            // should be deleted
                            // for get all symbols in gpx file id: 01
                            //if (symbols.indexOf($(this).find("sym").text()) === -1){
                            //  symbols.push($(this).find("sym").text());
                            //}

                            var lat_log = new google.maps.LatLng($(this).attr("lat"), $(this).attr("lon"));
                            var marker = new google.maps.Marker({
                                position: lat_log,
                                animation: google.maps.Animation.DROP,
                                title: $(this).find("name").text(),
                                icon: getMarkerIcon($(this).find("sym").text())
                            });
                            trail.markers.push(marker);

                            // add info window for each marker
                            var iw1 = new google.maps.InfoWindow({
                                content: marker.getTitle()
                            });
                            google.maps.event.addListener(marker, "mousedown", function (e) { iw1.open(map, this); });
                            //google.maps.event.addListener(marker, "mouseout", function (e) {
                            //  iw1.close(map, this);
                            //});
                        });


                    });
                }
            });
        };

        var display_trails = function(trails_to_displayed) {
            for (var i = 0; i < trails_to_displayed.length; i++){


                for (var j = 0; j < trails_to_displayed[i].google_poly.length; j++){
                    trails_to_displayed[i].google_poly[j].setMap(map);

                    trails_to_displayed[i].google_poly[j].getPath().forEach(function(latLng) {
                        bounds.extend(latLng);
                    });
                }

                // display markers when zoom in at a certain level
                //for (var j = 0; j < trails_to_displayed[i].markers.length; j++){
                //  trails_to_displayed[i].markers[j].setMap(map);
                //}
                trails_to_displayed[i].title_marker.setMap(map);

            }
        };

        var clear_bounds = function () {
            bounds = new google.maps.LatLngBounds();
        };

        var fit_bounds = function () {
            map.fitBounds(bounds);
        };

        return {
            getActivitiesIconUrl : function(actName){
                return getActivitiesIconUrl(actName);
            },
            allTrails: function() {
                return trails;
            },
            getMap: function() {
                return map;
            },
            setMap: function(new_map) {
                map = new_map;
            },
            preload_dis_act_diff: function (){
                // load distance,difficulty and activity
                //  is not here yet
                var src = "data/db/Data.xml";
                $.ajax({
                    type: "GET",
                    url: src,
                    dataType: "xml",
                    async: false,
                    success: function (xml) {
                        $(xml).find("ROW").each(function () {

                            trails.push({
                                MainTrail: $(this).find("MainTrail").text(),
                                IndividualTrail: $(this).find("IndividualTrail").text(),
                                difficulty: $(this).find("Difficulty").text(),
                                activity: $(this).find("Activities").text(),
                                distance: parseInt($(this).find("Distance").text()),
                                google_poly: [],
                                markers:[],
                                title_marker: null,
                                weather_marker: null,
                                max_lat: null,
                                min_lat: null,
                                mean_lon: null
                            });
                        });
                    }
                });



            },

            preload_title_marker: function(trail) {
                var src = getGpxUrl(trail.MainTrail, trail.IndividualTrail);
                $.ajax({
                    type: "GET",
                    url: src,
                    dataType: "xml",
                    async: false,
                    success: function (xml) {
                        // setup title_marker
                        var max_lat = $(xml).find("bounds").attr("maxlat");
                        var max_lon = $(xml).find("bounds").attr("maxlon");
                        var min_lat = $(xml).find("bounds").attr("minlat");
                        var min_lon = $(xml).find("bounds").attr("minlon");
                        trail.max_lat = max_lat;
                        trail.min_lat = min_lat;
                        trail.mean_lon = max_lon - (Math.abs(max_lon) - Math.abs(min_lon))/2;
                        trail.title_marker = new google.maps.Marker({
                            position: new google.maps.LatLng(max_lat, trail.mean_lon),
                            animation: google.maps.Animation.DROP,
                            title: trail.IndividualTrail,
                            icon: getActivitiesIconUrl(trail.activity)
                        });
                        var iw1 = new google.maps.InfoWindow({
                            content: trail.IndividualTrail +  '<br/>' +
                            'Distance: ' + trail.distance + 'km<br/>' +
                            'Activity: ' + trail.activity + '<br/>' +
                            'Difficulty: ' + trail.difficulty + '<br/>'
                        });
                        google.maps.event.addListener(trail.title_marker, "mousedown", function (e) { iw1.open(map, this); });

                    }
                });
            },
            load_data: function(trail) {
                load_data(trail);
            },
            get_index_by_trail_name: function (trail_name) {
                for (var i = 0; i < trails.length; i++){
                    if (trails[i].IndividualTrail === trail_name){
                        return i;
                    }
                }
                return -1;
            },
            display_trails: function(trails_to_displayed) {
                display_trails(trails_to_displayed);
            },
            display_markers: function() {
                for (var i = 0; i < res.length; i++){
                    for (var j = 0; j < res[i].markers.length; j++){
                        res[i].markers[j].setMap(map);
                    }
                    res[i].title_marker.setMap(null);
                }
            },
            clear_markers: function() {
                for (var i = 0; i < res.length; i++){
                    for (var j = 0; j < res[i].markers.length; j++){
                        res[i].markers[j].setMap(null);

                    }
                    res[i].title_marker.setMap(map);
                }
            },
            clear_bounds: function () {
                clear_bounds();
            },
            fit_bounds : function () {
                fit_bounds();
            },
            removeAll_gpx: function() {
                // no use, cannot be used, wrong
                while (trails.length != 0){
                    trails.pop().setMap(null);
                }
                while (markers.length != 0){
                    markers.pop().setMap(null);
                }
            },
            centerOnMe: function($scope, loading, GeolocationService) {
                if(!map) {
                    return;
                }

                GeolocationService.getLocation().then(function(result) {
                    curr_latLng = new google.maps.LatLng(result.lat, result.lng);
                    map.setCenter(curr_latLng);
                    map.setZoom(14);
                    var marker = new google.maps.Marker({
                        position: curr_latLng,
                        map: map,
                        animation: google.maps.Animation.DROP,
                        title: 'I\'m here'
                    });
                    if (curr_marker != null){
                        curr_marker.setMap(null);
                    }

                    curr_marker = marker;
                    loading.finishLoading();
                });

            },
            getAndDisplayTrailsByConditions: function (distance, difficulty, activities, time, IsPrecise, allowance_dis_diff, allowance_diff_time, MIN_LENGTH, GeolocationService, loading){
                /**
                 *   MIN_LENGTH has problem
                 * IsPrecise is a trigger, when it is on(true), all results must be precise
                 *    (distance and time still has its allowance), when it is off(false),
                 *    some difficulty or activity not matched may be inserted into the results
                 * IsPrecise, allowance_dis_diff, allowance_diff_time, MIN_LENGTH are for user
                 *    preference setting
                 * 1. get trails by the activity --> results
                 * 2. get trails by the difficulty from last results --> results
                 * 3. get trails by distance from last results --> results, since we dont have
                 *      many trails, plus in my opinion user want some results when there could not
                 *      have enough results, it will match some trails that closest to the distance
                 *      when there are not enough matched trails
                 * 4. using the last results fetch info about time from google map, according info from
                 *      google map filter rest of trails
                 */

                    // check deviation condition
                IsPrecise = typeof IsPrecise !== 'undefined'? IsPrecise : false;
                // it allow difference of 20km for distance
                allowance_dis_diff = typeof allowance_dis_diff !== 'undefined' ? allowance_dis_diff : 20;

                // allowance difference for time is 1.5hr
                allowance_diff_time = typeof allowance_diff_time !== 'undefined' ? allowance_diff_time : 1.5;

                // minimum number of results
                // default value is 2, and if the setting value is greater than number
                //    trails, then the value will be the number of trails
                MIN_LENGTH = typeof MIN_LENGTH !== 'undefined' ? (MIN_LENGTH > trails.length ? trails.length : MIN_LENGTH) : 2;

                var array_acts = activities.split(",");

                var res_trails = [];
                for (var i = 0; i < trails.length; i++){
                    for (var z = 0; z < array_acts.length; z++){
                        if (trails[i].activity.toLocaleLowerCase().indexOf(array_acts[z].toLocaleLowerCase()) !== -1 ){
                            // for now activity matched, next do difficulty
                            var difficulties = trails[i].difficulty.toLocaleString().split(",");
                            for (var j = 0; j < difficulties.length; j++){
                                if (difficulties[j].toLocaleLowerCase() === difficulty.toLocaleLowerCase()){
                                    // for now difficulty matched, next do distance,
                                    if ((trails[i].distance === distance) ||
                                        (trails[i].distance <= (distance + allowance_dis_diff)
                                        && (trails[i].distance >= (distance - allowance_dis_diff)))){
                                        res_trails.push(trails[i]);
                                        break;
                                    } // if -- distance
                                    break;
                                } // if -- difficulty
                            } // for -- difficulty
                        } // if -- activity
                    }

                } // for -- trails.length
                // for now all precise matching is done, and then check on the number of result, if it is too small
                // let's say it is less than 2, then add a closest distance matched trail into the results
                if (!IsPrecise) {
                    while (res_trails.length < MIN_LENGTH){
                        /**
                         * 1. find the maximum difference of distance in the result set
                         * 2. iterate whole trails, find the minimum difference of distance for every trail
                         * 3. if the difference is less than or equal the maximum difference of distance is the result set,
                         *      then this trail must already in the result set, find another one
                         * 4. if not, add this trail
                         * 5. repeat until results have enough trails
                         */

                        var max_dis_diff_have = 0;
                        for (var i = 0; i < res_trails.length; i++){
                            if (Math.abs(res_trails[i].distance - distance) > max_dis_diff_have){
                                max_dis_diff_have = Math.abs(res_trails[i].distance - distance);
                            }
                        } // for

                        var searched_index = [];
                        while (true){
                            var min_dis_difference_trails = 9999999;
                            var index_min_dis_difference_trails = -1;
                            for (var i = 0; i < trails.length; i++){
                                if (searched_index.indexOf(i) != -1){
                                    continue;
                                }
                                if (Math.abs(trails[i].distance - distance) < min_dis_difference_trails){
                                    min_dis_difference_trails = Math.abs(trails[i].distance - distance);
                                    index_min_dis_difference_trails = i;
                                }
                            } // for
                            searched_index.push(index_min_dis_difference_trails);
                            if (min_dis_difference_trails > max_dis_diff_have){
                                res_trails.push(trails[index_min_dis_difference_trails]);
                                break;
                            }
                        } // while -- true

                    } // while MIN_LENGTH
                } // if -- IsPrecise


                // distance, activity and difficulty have been matched, next do time
                // it requires google maps
                // limitations
                //    Requests are also rate limited. If too many elements are requested within a certain time period,
                //    an OVER_QUERY_LIMIT response code will be returned.

                var temp_res_trails = [];

                // get current position here
                GeolocationService.getLocation().then(function(result) {
                    var curr_latLng = new google.maps.LatLng(result.lat, result.lng);
                    var service = new google.maps.DistanceMatrixService;
                    var dest_lat_lng = [];
                    for (var i = 0; i < res_trails.length; i++){
                        dest_lat_lng.push(res_trails[i].title_marker.getPosition());
                    }
                    service.getDistanceMatrix({
                        origins: [curr_latLng],
                        destinations: dest_lat_lng,
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: true
                    }, function(response, status) {
                        if (status !== google.maps.DistanceMatrixStatus.OK) {
                            alert('Error was: ' + status);
                        } else {
                            var originList = response.originAddresses;
                            var destinationList = response.destinationAddresses;
                            for (var i = 0; i < originList.length; i++) {
                                var results = response.rows[i].elements;
                                for (var j = 0; j < results.length; j++) {

                                    if ((results[j].duration.value/3600 >= time - allowance_diff_time) && (results[j].duration.value/3600 <= time + allowance_diff_time)){
                                        temp_res_trails.push(res_trails[j]);
                                    }
                                }
                            }
                            if (temp_res_trails.length !== 0) {
                                // to avoid get an empty results
                                res_trails = temp_res_trails;
                            }
                            res = res_trails;
                            for ( i = 0; i < res.length; i++){
                                load_data(res[i]);
                            }
                            display_trails(res);
                            fit_bounds();
                            clear_bounds();
                            loading.finishLoading();


                        }
                    });

                });

            },
            getRes : function() {
                return res;
            },
            getAndDisplayTrailsByName : function (name, loading) {


                res = getTrailsByName(name);
                if (res.length !== 0) {
                    for (var i = 0; i < res.length; i++){
                        load_data(res[i]);
                    }
                    display_trails(res);
                    fit_bounds();
                    clear_bounds();
                    loading.finishLoading();
                    return true;
                } else {
                    return false;
                }


            },
            getTrailsByName : function (name) {
                return getTrailsByName(name);
            },
            getAndDisplayTrailsByAct : function (act, loading) {

                res = getTrailsByActivity(act);
                if (res.length !== 0) {
                    for (var i = 0; i < res.length; i++){
                        load_data(res[i]);
                    }
                    display_trails(res);
                    fit_bounds();
                    clear_bounds();
                    loading.finishLoading();
                    return true;
                } else {
                    loading.finishLoading();
                    return false;
                }
            },
            getTrailsByActivity : function(act) {
                return getTrailsByActivity(act);
            },
            searchTrailsByName : function (keyword) {
                var res_trails = [];
                for (var i = 0; i < trails.length; i++) {
                    if (trails[i].IndividualTrail.toLocaleLowerCase().indexOf(keyword.toLocaleString().toLocaleLowerCase()) !== -1){
                        res_trails.push({
                            name: trails[i].IndividualTrail,
                            img: getActivitiesIconUrl(trails[i].activity)
                        });
                    }
                }
                return res_trails;
            },
            getAllActivities : function () {
                var res = [];

                for (var i = 0; i < trails.length; i++) {
                    var activities = trails[i].activity.split(",");
                    for (var j = 0; j < activities.length; j++) {
                        if (res.indexOf(activities[j]) === -1) {
                            res.push(activities[j]);
                        }
                    }

                }

                return res;
            },
            getAllTrailsLatLngWithTrailName : getAllTrailsLatLngWithTrailName

        };
    });