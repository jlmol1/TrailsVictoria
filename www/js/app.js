// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller: 'TabCtrl'
            })


            .state('tab.map_page', {
                url: '/map_page/',
                views: {
                    'tab-pages': {
                        templateUrl: 'templates/map_page.html',
                        controller: 'MapPageCtrl'
                    }
                }
            })

            .state('tab.dummy', {
                url: '/dummy',
                views: {
                    'tab-dummy': {
                        templateUrl: 'templates/dummy.html'
                    }
                }
            })

          .state('tab.front_page', {
            url: '/index',
            views: {
              'tab-pages': {
                templateUrl: 'templates/front_page.html'
              }
            }
          })

          .state('tab.search_by_name', {
            url: '/search_by_name',
            views: {
              'tab-search_by_name' : {
                templateUrl: 'templates/search_by_name.html',
                controller: 'SearchByNameCtrl'
              }
            }
          })



          .state('tab.display_map', {
            url: '/display_map',
            views: {
              'tab-search_by_name' : {
                templateUrl: 'templates/map_page.html',
                controller: 'MapPageNameCtrl'
              }
            }
          })

          .state('tab.search_by_act_display_map', {
            url: '/search_by_acts/display_map',
            views: {
              'tab-activities' : {
                templateUrl: 'templates/map_page.html',
                controller: 'MapPageActCtrl'
              }
            }
          })

          .state('tab.activities_page', {

            views: {
              'tab-activities' : {
                templateUrl: 'templates/activity_page.html',
                controller: 'ActivityPageCtrl'
              }
            }
          });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/index');

    });
