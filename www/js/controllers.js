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

  })

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

  })

  .controller('SearchByNameCtrl', function($scope, CacheData, search, $state){
    $scope.results = [];
    $scope.keyword = {};
    $scope.doSearch = function() {
      $scope.results = CacheData.searchTrailsByName($scope.keyword.first);
      if ($scope.results.length == 0){
        $scope.errMsg = 'Sorry! Nothing found. : (';
        $("#normal_display").hide("fast");
        $("#error_display").hide("fast");
        $("#error_display").show(100);
      } else {
        $scope.errMsg = '';
        $("#normal_display").hide("fast");
        $("#normal_display").show(100);
        $("#error_display").hide("fast");
      }
    };

    $scope.display_map = function (name) {
      search.setSearchOption("name");
      search.setName(name);

      $state.go("tab.display_map");
    }
  })

  .controller('MapPageNameCtrl', function($scope, CacheData, $ionicLoading, $stateParams, $state, GeolocationService, loading, search) {

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
      $state.go('tab.search_by_name');

    };
  })

  .controller('MapPageActCtrl', function($scope, CacheData, $ionicLoading, $stateParams, $state, GeolocationService, loading, search) {

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
      $state.go('tab.activities_page');

    };
  })

  .controller('ActivityPageCtrl', function($scope, search, $state, CacheData) {

    var activities = CacheData.getAllActivities();

    $scope.acts = [];

    for (var i = 0; i < activities.length; i++) {
      $scope.acts.push({
        name: activities[i],
        img: CacheData.getActivitiesIconUrl(activities[i])
      });
    }

    $scope.display_map = function (act) {
      search.setSearchOption("act");
      search.setAct(act);

      $state.go("tab.search_by_act_display_map");
    }
  });





