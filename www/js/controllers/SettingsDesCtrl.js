/**
 * Created by jupiterli on 22/09/2015.
 */



trails_app.

    controller('SettingsDesCtrl', function($scope, preferencesDataService) {
        $scope.data = {};

        $scope.curr_radius = preferencesDataService.getSeachRadius();

        $scope.saveData = function() {
            preferencesDataService.setSearchRadius($scope.data.radius);
            $scope.curr_radius = preferencesDataService.getSeachRadius();
        }
    });