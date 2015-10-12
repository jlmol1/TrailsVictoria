/**
 * Created by jupiterli on 11/10/2015.
 */


trails_app
    .directive('fbPost', function($document) {
        return {
            restrict: 'EA',
            replace: false,
            link: function($scope, element, attr) {
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=1643180689265172 ";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }
        }
    });