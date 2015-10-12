/**
 * Created by jupiterli on 17/09/2015.
 */

trails_app.controller('DestSearchCtrl', function(
    $scope,
    googleMapsService,
    searchService,
    cacheDataService,
    loadingService,
    $ionicActionSheet,
    weatherService,
    geolocationService,
    preferencesDataService,
    overlappingMarkerSpiderfyService,
    $compile) {

    // collect user input for search, des address
    $scope.keyword = {};

    // hide function buttons like get weather before user searched something
    $('#buttons-panel-dest').hide("fast");

    // initialize google map
    var google_map = googleMapsService.createAGoogleMapByName("dest_search_map");
    google_map.setOptions({disableDefaultUI:true});


    // when zoom in level greater than this level, markers will display
    var minFTZoomLevel = 10;

    $scope.doSearch = function() {
        $('#buttons-panel-dest').show(100);
        console.log("DestSearchCtrl: starting search on des of ", $scope.keyword.address);
        searchService.searchOnDestination(google_map,
            $scope.keyword.address,
            googleMapsService,
            cacheDataService,
            loadingService,
            preferencesDataService.getSeachRadius(),
            overlappingMarkerSpiderfyService,
            $scope,
            $compile);

        // display markers
        google.maps.event.addListener(google_map, 'zoom_changed', function() {
            zoomLevel = google_map.getZoom();
            if (zoomLevel >= minFTZoomLevel) {
                console.log("DestSearchCtrl: zoom changed to " + zoomLevel.toLocaleString() + ", markers are going to be shown");
                cacheDataService.display_markers();
            } else {
                console.log("DestSearchCtrl: zoom changed to " + zoomLevel.toLocaleString() + ", markers are going to be hided");
                cacheDataService.clear_markers();
            }
        });

    };

    // used to show direction from specific location to a trail
    // it first show every trail's name, user choose one, then
    // a route will display
    /*$scope.googleDirection = function () {
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
    };*/


    $scope.googleDirection = function (trailName){
        console.log("DestSearchCtrl: direct me button clicked, trail name is " + trailName);

        loadingService.startLoading();
        var trail = cacheDataService.getTrailsByName(trailName);
        if (trail.length != 1){
            // error occurs, more than one trail matched or no trail matched
            // both are not allowed
            // some error msg must be shown
            return;
        }
            var start = $scope.keyword.address;
            var end = trail[0].google_poly[0].getPath().getAt(0);
            googleMapsService.calculateAndDisplayRoute(start, end, google_map);
            loadingService.finishLoading();

    };

    var isWatchingOn = false;
    $scope.watchOn = function() {
        if (isWatchingOn) {
            isWatchingOn = false;
            stop_watchlocation();
            alert("Stop watching on.");
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
            case error.PERMISSION_DENIED: console.log("DestSearchCtrl: watch on, user did not share geolocation data");
                break;
            case error.POSITION_UNAVAILABLE: console.log("DestSearchCtrl: watch on, could not detect current position");
                break;
            case error.TIMEOUT: console.log("DestSearchCtrl: watch on, retrieving position timedout");
                break;
            default: console.log("DestSearchCtrl: watch on, unknown error");
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
        var trails = cacheDataService.getRes();

        if (trails.length != 0 && trails[0].weather_marker != null) {
            if (trails[0].weather_marker.getMap() != null){
                loadingService.finishLoading();
                for (var j = 0; trails.length; j++){
                    trails[j].weather_marker.setMap(null);
                }
                return;
            }

        }

        var map = cacheDataService.getMap();
        if (trails.length != 0){
            loadingService.startLoading();
            for (var i = 0; i < trails.length; i++){
                // get weather condition
                weatherService.getWeather( map, trails[i], loadingService);

            }
        } else {
            alert("No search results, cannot display weather condition.");
        }


    };

    $scope.partialMatchedAddresses = [];
    $scope.getAddress = function() {
        googleMapsService.getAddressByAddress($scope.keyword.address).then(function(results) {
            $scope.partialMatchedAddresses = results;
        });
    };

    $scope.input_changed = function() {
        // for debugging
        console.log("des search input changed to " + $scope.keyword.address);
        if ($scope.keyword.address.trim(' ').length == 0) {
            $scope.partialMatchedAddresses = [];
            $('#suggestion_des').hide("fast");
            return;
        }
        $scope.getAddress();

        $('#suggestion_des').show(100);

        $('#dest_search_map').click(function() {
            $('#suggestion_des').hide("fast");
        });
    };

    $scope.suggestSearch = function(address) {
        $scope.keyword.address = address;
        $('#suggestion_des').hide("fast");
        $scope.doSearch();
    }

});
