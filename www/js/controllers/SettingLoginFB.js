/**
 * Created by jupiterli on 6/10/2015.
 */


trails_app.
    controller('SettingLoginFB', function($scope, $ionicModal, $timeout, ngFB) {
        ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
            function (response) {
                if (response.status === 'connected') {
                    console.log('Facebook login succeeded');
                } else {
                    alert('Facebook login failed');
                }
            });
    });