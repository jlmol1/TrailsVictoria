/**
 * Created by jupiterli on 22/09/2015.
 */



trails_app.

    controller('SettingsMulCtrl', function($scope, preferencesDataService) {
        $scope.precise = {};

        $scope.isPrecise = preferencesDataService.getIsPrecise();

        $scope.preciseChanged = function() {
            console.log('SettingsMulCtrl: precise search is', $scope.precise.checked);
            preferencesDataService.setIsPrecise($scope.precise.checked);
        }
    });