/**
 * Created by jupiterli on 9/10/2015.
 */


trails_app

.directive('googleInfoWindowButton', function($compile, $q) {
        return {
            restrict: 'E',

            template : '<button class="button button-positive button-small" ng-click="test()">Direct me</button>',

            replace: true,

            controller : function($scope) {
                $scope.test = function() {
                    alert('alert from directive googleInfo');
                }
            }


        }
    });