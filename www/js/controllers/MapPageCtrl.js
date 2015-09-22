/**
 * Created by jupiterli on 14/09/2015.
 * A controller used by map page.
 * It will create a google map on the screen and call cacheDataService to
 *  show trails on the google map and initialize markers on each trails
 */

trails_app


    .controller('MapPageCtrl', function(
        $scope,
        cacheDataService,
        $ionicLoading,
        $stateParams,
        $state,
        geolocationService,
        loadingService,
        searchService,
        googleMapsService,
        $ionicActionSheet,
        weatherService,
        preferencesDataService) {


        // testing purpose
        console.log("Test msg, shown means MapPageCtrl is working");

        loadingService.startLoading();
        // title of this page, dynamic
        $scope.title = "Search Results";

        // id of div of google map
        $scope.mapDivID = searchService.getSearchOption() + "_map";


        // when zoom in level greater than this level, markers will display
        var minFTZoomLevel = 10;


        var google_map = googleMapsService.createAGoogleMapByName($scope.mapDivID);
        cacheDataService.setMap(google_map);


        // should be deleted
        // for get all symbols in gpx file id: 01
        //var trails_test = CacheData.allTrails();
        //for (var j = 0; j < trails_test.length; j++){
        //  CacheData.load_data(trails_test[j]);
        //}

        // display trails first and then markers when zoom in at a certain level
        searchService.setIsPrecise(preferencesDataService.getIsPrecise());
        $scope.title = searchService.doSearch(cacheDataService, geolocationService, loadingService);

        // display markers
        google.maps.event.addListener(google_map, 'zoom_changed', function() {
            zoomLevel = google_map.getZoom();
            if (zoomLevel >= minFTZoomLevel) {
                cacheDataService.display_markers();
            } else {
                cacheDataService.clear_markers();
            }
        });

        // used to show direction from current location to a trail
        // it first show every trail's name, user choose one, then
        // a route will display
        $scope.googleDirection = function () {
            var searchResult = cacheDataService.getRes();
            var buttons = [];
            for (var i = 0; i < searchResult.length; i++){
                buttons.push(
                    {text : searchResult[i].IndividualTrail}
                );
            }

            $ionicActionSheet.show({
                buttons: buttons,
                titleText: 'Choose a trail',
                cancelText: 'Cancel',
                cancel: function() {
                },
                buttonClicked: function(index) {
                    googleDirection(buttons[index].text);

                }
            });
        };


        var googleDirection = function (trailName){
            loadingService.startLoading();
            var trail = cacheDataService.getTrailsByName(trailName);
            if (trail.length != 1){
                // error occurs, more than one trail matched or no trail matched
                // both are not allowed
                // some error msg must be shown
                return;
            }
            geolocationService.getLocation().then(function(result) {
                var start = new google.maps.LatLng(result.lat, result.lng);
                var end = trail[0].google_poly[0].getPath().getAt(0);
                googleMapsService.calculateAndDisplayRoute(start, end, google_map);
                loadingService.finishLoading();
            });

        };

        var isWatchingOn = false;
        $scope.watchOn = function() {
            if (isWatchingOn) {
                isWatchingOn = false;
                stop_watchlocation();
            } else {
                isWatchingOn = true;
                initiate_watchlocation();
            }
        };

        var watchProcess = null;
        function initiate_watchlocation() {
            if (watchProcess == null) {
                loadingService.startLoading();
                watchProcess = navigator.geolocation.watchPosition(handle_geolocation_query, handle_errors);
            }
        }
        function stop_watchlocation() {
            if (watchProcess != null)
            {
                navigator.geolocation.clearWatch(watchProcess);
                watchProcess = null;
            }
        }
        function handle_errors(error)
        {
            switch(error.code)
            {
                case error.PERMISSION_DENIED: alert("user did not share geolocation data");
                    break;
                case error.POSITION_UNAVAILABLE: alert("could not detect current position");
                    break;
                case error.TIMEOUT: alert("retrieving position timedout");
                    break;
                default: alert("unknown error");
                    break;
            }
        }
        // for collect marker watch and erase previous one
        var marker_watch = null;
        function handle_geolocation_query(position) {
            if (marker_watch != null){
                marker_watch.setMap(null);
            }

            marker_watch = new google.maps.Marker({
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                map: google_map
            });
            google_map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            loadingService.finishLoading();
        }

        $scope.display_weather = function() {
            loadingService.startLoading();
            var trails = cacheDataService.getRes();
            if (trails[0].weather_marker != null) {
                if (trails[0].weather_marker.getMap() != null){
                    loadingService.finishLoading();
                    for (var j = 0; trails.length; j++){
                        trails[j].weather_marker.setMap(null);
                    }
                    return;
                }

            }
            var map = cacheDataService.getMap();
            for (var i = 0; i < trails.length; i++){
                // get weather condition
                weatherService.getWeather( map, trails[i], loadingService);

            }

        };

    });
