/**
 * Created by jupiterli on 14/09/2015.
 * A controller used by tab which is the bottom button list for navigation purpose and
 *  is available go through the whole application
 */

trails_app

    .controller('TabCtrl', function($scope, cacheDataService, $ionicLoading, weatherService, loadingService, geolocationService, $state, $ionicActionSheet, searchService) {

        // application started, pre-load data from gpx and xml files
        cacheDataService.preload_dis_act_diff();
        var trails = cacheDataService.allTrails();
        for (var i = 0; i < trails.length; i++){
            cacheDataService.preload_title_marker(trails[i]);
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
            cacheDataService.removeAll_gpx();

        };



        $scope.fineMe = function() {
            loadingService.startLoading($ionicLoading);
            cacheDataService.centerOnMe($scope, $ionicLoading, loadingService, geolocationService);
        };

        $scope.test = function() {
            cacheDataService.getTrailsByConditions(63, "Easy", "Cycling", 4);
        };

        $scope.display_weather = function() {
            loadingService.startLoading($ionicLoading);
            var trails = cacheDataService.getRes();
            var map = cacheDataService.getMap();
            for (var i = 0; i < trails.length; i++){
                // get weather condition
                weatherService.getWeather( map, trails[i], $ionicLoading, loadingService);

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
            searchService.setActivities($scope.activities);
            searchService.setDifficulty($scope.difficulty);
            searchService.setDistance($scope.distance);
            searchService.setTime($scope.time);
            searchService.setSearchOption("mul");
            $state.go("tab.map_page");
        };

    });

