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
  })

.controller('TermCtrl', function($scope) {
      $scope.groups = [{
        title: "Introduction",
        contents: [
          {
            line: "The application Trails Victoria provides a guide to the main trails in the state of Victoria, including their facilities, activities, and difficulties. The application makes use of data provided by the Victorian Government Data Directory www.data.vic.gov.au (site), operated on behalf of the government of the State of Victoria, Australia by the Department of State Development Business and Innovation. Throughout the Terms of Use the word we, us and our refer to the application Trails - Victoria and the words you and your refer to the person using the application.",
          }
        ]
      },
        {
          title: "Application of these Terms of Use",
          contents: [
            {
              line: "Any person who uses this application (by any means including any robot, spider, other automatic device or agent, or any manual process) is deemed to have accepted the Terms of Use. These Terms of Use will apply to any dataset or data provided by this site. But if those other terms are inconsistent with these Terms of Use, those other terms will prevail to the extent of the inconsistency."
            }
          ]
        },
        {
          title: "Disclaimer - Trails Victoria",
          contents: [
            {
              line: "The content of this application is made available for information purposes."
            },
            {
              line: "The datasets used through this site have been created by many different government agencies and we do not represent or warrant that any dataset or the data it contains is accurate, authentic or complete, or suitable for your needs. Changes in circumstances after the time of publication may impact the accuracy of datasets and their contents."
            },
            {
              line: "To the maximum extent permitted by law, we accept no liability whatsoever to you or to any person arising from or connected to with the use of or reliance on any information or advice provided on this site or incorporated into it by reference, including any dataset or data it contains. No responsibility is taken for any information or services that may appear on any linked websites."
            },
            {
              line: "We recommend that you exercise your own skill and care with respect to your use of this application and carefully evaluate the accuracy, currency, completeness and relevance of information on this application for your purposes, including datasets and data."
            },
            {
              line: "This application is not a substitute for independent professional advice and you should obtain any appropriate professional advice relevant to your individual circumstances to check whether this is permitted by the terms of the licence which applies to that dataset."
            }
          ]
        },
        {
          title: "Disclaimer - Links to external websites",
          contents: [
            {
              line: "This site contains links to external websites. We may have no control over the content of any linked sites, or the changes that may occur to the content on those sites. It is your responsibility to make your own decisions about the accuracy, currency, reliability and correctness of information contained in linked external websites. We assume no responsibility or liability for the condition or content of any third party website or for the operation or function of any service or facility offered on any third party website."
            }
          ]
        },
        {
          title: "Disclaimer - Security",
          contents: [
            {
              line: "You should be aware that the internet is an insecure public network that gives rise to a potential risk that your transactions are being viewed, intercepted or modified by third parties. We accept no liability for any interference with or damage to your device occurring in connection with or relating to this application or its use. You agree to use this application only for lawful purposes, and in a manner that does not infringe the rights of or inhibit the use and enjoyment of this application by any third party. This includes any conduct which is unlawful or which may harass or cause distress or inconvenience to any person and the transmission of obscene or offensive content or disruption to any part of the application. "
            }
          ]
        },
        {
          title: "Data and systems integrity",
          contents: [
            {
              line: "You acknowledge that we will not be responsible for any corruption or failed transmission of any information attributable to your device or any act or omission of your Internet Service Provider. You agree not to use any device, software or routine to interfere or attempt to interfere with the proper working of this application. You acknowledge that access to this application, or any data services accessed through it: a) may not be continuous or uninterrupted at all times; and b) may be interfered with by factors or circumstances outside of our control. This data service may be of assistance to you but the Trails -Victoria application and its data provider, the State of Victoria and its employees do not guarantee that the data service is without flaw of any kind or is wholly appropriate for your particular purpose and therefore disclaims all liability for any error, loss or other consequence which may arise from you relying on any information in this data service."
            }
          ]
        },
        {
          title: "Copyright and Attribution",
          contents: [
            {
              line: "You should comply with the Copyright and Attribution requirements. If used any data made available through this application, you should be aware that it will be done through the Creative Commons Attribution 3.0 Australia."
            }
          ]
        },
        {
          title: "Use of application",
          contents: [
            {
              line: "You must not use text or information provided via this application, including datasets or data they contain, in any of the following ways: â€¢ use the data in any application that pretends to be an official government service, or in any other way that suggests that the Department endorses you or your use. â€¢ present the data in a misleading or incorrect manner, or misrepresent the data through changing it or otherwise. â€¢ use this application for party political purposes. â€¢ use the data or this application in or to support a criminal or illicit activity. â€¢ use the data in any application, or in any other ways to inflame or make comments that are racist, sexist or homophobic, or which promote or incite violence and illegal activity."
            }
          ]
        },
        {
          title: "General",
          contents: [
            {
              line: "These Terms of Use are governed by, and are to be construed in accordance with, the laws of the State of Victoria, Australia. You agree that the courts of the State of Victoria, Australia have non-exclusive jurisdiction with respect to any matter arising from these Terms of Use or this application. If any provision of these Terms of Use is held to be invalid or unenforceable that provision may be: â€¢ read down to the extent necessary to make it valid and enforceable, or â€¢ severed and the remaining provisions of these Terms of Use enforced. Updated: 10 September 2015"
            }
          ]
        }
      ];

      /*
       * if given group is the selected group, deselect it
       * else, select the given group
       */
      $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
      };
      $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
      };
    });





