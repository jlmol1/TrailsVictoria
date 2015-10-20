/**
 * Created by Administrator on 2015/9/14.
 * This service is used to show or hide loading screen.
 * It only available on ios 8.2.1 or higher and android version(not clear yet)
 *  according its specification on ionic website
 */

trails_app

    .factory('loadingService', function($cordovaProgress, $ionicLoading, $timeout){
        return {
            startLoading: function () {
                $ionicLoading.show({
                    content: '<i class="icon ion-loading-d"></i>',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 5
                });
                console.log("loadingService: start loading.");
                //$cordovaProgress.showSimple(true);

                $timeout(function() {
                    $ionicLoading.hide();
                    console.log("loadingService: finish loading as it is timeout.");
                }, 4000);

            },
            finishLoading: function (){
                $ionicLoading.hide();
                console.log("loadingService: finish loading.");
                //$cordovaProgress.hide();
            }
        }
    });