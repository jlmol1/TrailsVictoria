/**
 * Created by jupiterli on 12/10/2015.
 */


trails_app

.controller('SettingsCtrl', function($scope, $cordovaOauth, $localStorage, $location, $state, $http, $cordovaFacebook) {

        $scope.init = function() {
            $scope.fbUserName = "";

            if($localStorage.hasOwnProperty("accessToken") === true) {
                $('#settings_facebook_a_login').hide("fast");
                $('#settings_facebook_a_logout').show("fast");
                $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
                    $scope.fbUserName = result.data.name;
                    console.log("SettingsCtrl: logged in username is ", $scope.fbUserName);
                }, function(error) {
                    alert("There was a problem getting your profile.  Check the logs for details.");
                    console.log(error);
                });
            } else {
                $('#settings_facebook_a_login').show("fast");
                $('#settings_facebook_a_logout').hide("fast");
                console.log("SettingsCtrl: Has not logged in.");
            }
        };

        $scope.login = function() {
            $cordovaOauth.facebook("1643180689265172", ["email", "user_website", "user_location", "user_relationships"]).then(function (result) {
                $localStorage.accessToken = result.access_token;
                $scope.init();

                $('#settings_facebook_a_login').hide("fast");
                $('#settings_facebook_a_logout').show("fast");

                $state.go("tab.setting_loginFB");
            }, function (error) {
                alert("There was a problem signing in!  See the console for logs");
                console.log(error);
            });
        };

        $scope.logout = function() {
            $cordovaFacebook.logout()
                .then(function(success) {
                    // success
                    console.log("facebook logout success");
                    $scope.fbUserName = "";
                    $('#settings_facebook_a_login').show("fast");
                    $('#settings_facebook_a_logout').hide("fast");
                }, function (error) {
                    // error
                    console.log("facebook logout failed");

                });
        };


    });