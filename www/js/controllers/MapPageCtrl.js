/**
 * Created by jupiterli on 14/09/2015.
 * A controller used by map page.
 * It will create a google map on the screen and call cacheDataService to
 *  show trails on the google map and initialize markers on each trails
 */

trails_app


    .controller('MapPageCtrl', function($scope, cacheDataService, $ionicLoading, $stateParams, $state, geolocationService, loadingService, searchService) {
        // testing purpose
        console.log("Test msg, shown means MapPageCtrl is working");

        loadingService.startLoading();
        // title of this page, dynamic
        $scope.title = "Search Results";



        // when zoom in level greater than this level, markers will display
        var minFTZoomLevel = 10;


        var latLng_vic = new google.maps.LatLng(-37, 144);

        var myOptions = {
            zoom: 7,
            center: latLng_vic,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(
            document.getElementById("map"),
            myOptions
        );
        cacheDataService.setMap(map);


        // should be deleted
        // for get all symbols in gpx file id: 01
        //var trails_test = CacheData.allTrails();
        //for (var j = 0; j < trails_test.length; j++){
        //  CacheData.load_data(trails_test[j]);
        //}

        // display trails first and then markers when zoom in at a certain level
        $scope.title = searchService.doSearch(cacheDataService, geolocationService, loadingService);

        // display markers
        google.maps.event.addListener(map, 'zoom_changed', function() {
            zoomLevel = map.getZoom();
            if (zoomLevel >= minFTZoomLevel) {
                cacheDataService.display_markers();
            } else {
                cacheDataService.clear_markers();
            }
        });







    });
