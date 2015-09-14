/**
 * Created by jupiterli on 14/09/2015.
 */

angular.module('starter.controllers', ['ionic'])

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
});