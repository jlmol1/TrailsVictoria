/**
 * Created by jupiterli on 14/09/2015.
 * A controller used by tab which is the bottom button list for navigation purpose and
 *  is available go through the whole application
 */

trails_app

    .controller('TabCtrl', function(
        $scope,
        cacheDataService,
        $ionicLoading,
        weatherService,
        loadingService,
        geolocationService,
        $state,
        $ionicActionSheet,
        searchService,
        preferencesDataService,
        $compile) {

        // application started, pre-load data from gpx and xml files
        cacheDataService.preload_dis_act_diff();
        var trails = cacheDataService.allTrails();
        for (var i = 0; i < trails.length; i++){
            cacheDataService.preload_title_marker(trails[i], $compile, $scope);
        }

        // initial prefer data
        preferencesDataService.init();




        $scope.removeAll = function() {
            cacheDataService.removeAll_gpx();

        };



        $scope.fineMe = function() {
            loadingService.startLoading($ionicLoading);
            cacheDataService.centerOnMe($scope, $ionicLoading, loadingService, geolocationService);
        };


        $scope.test = function() {
            alert("alert");
        }


    });

