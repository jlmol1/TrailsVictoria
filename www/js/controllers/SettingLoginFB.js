/**
 * Created by jupiterli on 6/10/2015.
 */


trails_app.
    controller('SettingLoginFB', function($scope, $ionicModal, $timeout, ngFB) {
        ngFB.login({scope: 'email,publish_actions'}).then(
            function (response) {
                if (response.status === 'connected') {
                    console.log('Facebook login succeeded');
                } else {
                    alert('Facebook login failed');
                }
            });

        ngFB.api({
            path: '/me',
            params: {fields: 'id,name'}
        }).then(
            function (user) {
                $scope.user = user;
            },
            function (error) {
                alert('Facebook error: ' + error.error_description);
            });
    });