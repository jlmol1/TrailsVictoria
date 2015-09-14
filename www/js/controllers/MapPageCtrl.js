/**
 * Created by jupiterli on 14/09/2015.
 */

angular.module('starter.controllers', ['ionic'])


.controller('MapPageCtrl', function($scope, CacheData, $ionicLoading, $stateParams, $state, GeolocationService, loading, search) {
    loading.startLoading($ionicLoading);
    // title of this page, dynamic
    $scope.title = "Search Results";

    // display buttons
    $scope.mainCtrl = CacheData.getMainCtrl();
    $scope.mainCtrl.showMapPageButtons = true;
    $scope.mainCtrl.showFrontPageButtons = false;

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
    CacheData.setMap(map);


    // should be deleted
    // for get all symbols in gpx file id: 01
    //var trails_test = CacheData.allTrails();
    //for (var j = 0; j < trails_test.length; j++){
    //  CacheData.load_data(trails_test[j]);
    //}

    // display trails first and then markers when zoom in at a certain level
    $scope.title = search.doSearch(CacheData, GeolocationService, $ionicLoading, loading);

    // display markers
    google.maps.event.addListener(map, 'zoom_changed', function() {
        zoomLevel = map.getZoom();
        if (zoomLevel >= minFTZoomLevel) {
            CacheData.display_markers();
        } else {
            CacheData.clear_markers();
        }
    });





    $scope.backToFrontPage = function() {
        $scope.mainCtrl = CacheData.getMainCtrl();
        $scope.mainCtrl.showMapPageButtons = false;
        $scope.mainCtrl.showFrontPageButtons = true;
        $state.go('tab.front_page');

    };

});
