/**
 * Created by jupiterli on 14/09/2015.
 * controller used by search by name page
 * it will collect keywords (one or more) from users input and pass it to
 *  searchService, and then redirect to map page
 */

trails_app

    .controller('SearchByNameCtrl', function($scope, cacheDataService, searchService, $state){
        $scope.results = [];
        $scope.keyword = {};
        $("#normal_display").hide("fast");
        $("#error_display").hide("fast");
        $scope.doSearch = function() {
            $scope.results = cacheDataService.searchTrailsByName($scope.keyword.first);
            if ($scope.results.length == 0){
                $scope.errMsg = 'Sorry! Nothing found. : (';
                $("#normal_display").hide("fast");
                $("#error_display").hide("fast").show(100);
            } else {
                $scope.errMsg = '';
                $("#normal_display").hide("fast").show(100);
                $("#error_display").hide("fast");
            }
        };

        $scope.display_map = function (name) {
            searchService.setSearchOption("name");
            searchService.setName(name);

            $state.go("tab.display_map");
        }
    });