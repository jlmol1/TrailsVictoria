/**
 * Created by jupiterli on 14/09/2015.
 */

angular.module('starter.controllers', ['ionic'])

.controller('TabCtrl', function($scope, CacheData, $ionicLoading, weatherService, loading, GeolocationService, $state, $ionicActionSheet, search) {
    $scope.mainCtrl = {};
    $scope.mainCtrl.showMapPageButtons = false;
    $scope.mainCtrl.showFrontPageButtons = true;
    CacheData.setMainCtrl($scope.mainCtrl);
    // application started, pre-load data from gpx and xml files
    CacheData.preload_dis_act_diff();
    var trails = CacheData.allTrails();
    for (var i = 0; i < trails.length; i++){
        CacheData.preload_title_marker(trails[i]);
    }

    // initial search info
    $scope.search = {
        'time' : '24',
        'distance' : '125',
        'difficulty' : '4',
        'horse_riding' : false,
        'walking' : false,
        'cycling' : false,
        'mountain_biking' : false
    };





    $scope.removeAll = function() {
        CacheData.removeAll_gpx();

    };

    $scope.home = function () {
        $scope.mainCtrl.showMapPageButtons = false;
        $scope.mainCtrl.showFrontPageButtons = true;
        $state.go("tab.front_page");
    };

    $scope.fineMe = function() {
        loading.startLoading($ionicLoading);
        CacheData.centerOnMe($scope, $ionicLoading, loading, GeolocationService);
    };

    $scope.test = function() {
        CacheData.getTrailsByConditions(63, "Easy", "Cycling", 4);
    };

    $scope.display_weather = function() {
        loading.startLoading($ionicLoading);
        var trails = CacheData.getRes();
        var map = CacheData.getMap();
        for (var i = 0; i < trails.length; i++){
            // get weather condition
            weatherService.getWeather( map, trails[i], $ionicLoading, loading);

        }

    };

    $scope.searchByMul  = function () {
        // get search info
        $scope.distance = $scope.search.distance;
        $scope.time = $scope.search.time;
        switch ($scope.search.difficulty){
            case "1": $scope.difficulty = "Ungraded";
                break;
            case "2": $scope.difficulty = "Very easy";
                break;
            case "3": $scope.difficulty = "Easy";
                break;
            case "4": $scope.difficulty = "Moderate";
                break;
            case "5": $scope.difficulty = "Difficult";
                break;
            case "6": $scope.difficulty = "More difficult";
                break;
            case "7": $scope.difficulty = "Very difficult";
                break;
            default : $scope.difficulty = "Ungraded";
        }
        $scope.activities = '';
        if ($scope.search.horse_riding){
            $scope.activities += ",Horse Riding";
        }
        if ($scope.search.walking){
            $scope.activities += ",Walking";
        }
        if ($scope.search.cycling){
            $scope.activities += ",Cycling";
        }
        if ($scope.search.mountain_biking){
            $scope.activities += ",Mountain Biking";
        }
        var href = "#/tab/map_page/" + $scope.distance + "_" + $scope.difficulty + "_" + $scope.activities + "_" + $scope.time;
        search.setActivities($scope.activities);
        search.setDifficulty($scope.difficulty);
        search.setDistance($scope.distance);
        search.setTime($scope.time);
        search.setSearchOption("mul");
        $state.go("tab.map_page");
    };


    $scope.showActionSheet = function() {
        $scope.mainCtrl.showMapPageButtons = false;
        $scope.mainCtrl.showFrontPageButtons = true;
        $state.go("tab.activities_page");
    };

    $scope.searchByName = function () {
        $scope.mainCtrl.showMapPageButtons = false;
        $scope.mainCtrl.showFrontPageButtons = true;
        $state.go("tab.search_by_name");
    }

});

