/**
 * Created by jupiterli on 14/09/2015.
 * A controller used by activity page which split trails based on activities
 * Based on user choice, it will set parameters to searchService and redirect to map page
 */

trails_app

    .controller('ActivityPageCtrl', function($scope, searchService, $state, cacheDataService, loadingService) {

        var activities = cacheDataService.getAllActivities();

        $scope.acts = [];

        for (var i = 0; i < activities.length; i++) {
            $scope.acts.push({
                name: activities[i],
                img: cacheDataService.getActivitiesIconUrl(activities[i])
            });
        }

        $scope.display_map = function (act) {

            searchService.setSearchOption("act");
            searchService.setAct(act);

            $state.go("tab.search_by_act_display_map");
        }
    });
