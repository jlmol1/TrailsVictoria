/**
 * Created by jupiterli on 14/09/2015.
 */

angular.module('starter.controllers', ['ionic'])

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
