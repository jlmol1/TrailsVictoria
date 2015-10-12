/**
 * Created by jupiterli on 6/10/2015.
 */


trails_app.
    controller('SettingLoginFB', function($scope, $ionicModal, $timeout, $localStorage, $location, $http) {
        $scope.init = function() {
            if($localStorage.hasOwnProperty("accessToken") === true) {
                $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
                    $scope.profileData = result.data;
                }, function(error) {
                    alert("There was a problem getting your profile.  Check the logs for details.");
                    console.log(error);
                });
            } else {
                alert("Not signed in");
                $location.path("/settings");
            }
        };
    });