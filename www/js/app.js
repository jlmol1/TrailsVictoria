// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'trails_app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// services (factories) are in services folder
// controllers are in controllers folder

var trails_app = angular.module('trails_app', ['ionic']);

trails_app
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

            /**
             * Below 3 state used the exactly same template, then a bug occurred.
             *  When user switched to another page while the previous page still
             *  stayed in map page, and user direct to map page again from current page,
             *  then map page will show nothing. When user came back to previous mag page
             *  and go back to this map page's previous page, then other pages can direct
             *  to map page again.
             *
             * Tried to create 3 different files yet same codes controllers and templates
             *  for those, but failed. (see version 1.2)
             * */
            .state('tab.map_page', {
                // used by complex search, home
                url: '/map_page/',
                views: {
                    'tab-pages': {
                        templateUrl: 'templates/map_page.html',
                        controller: 'MapPageCtrl'
                    }
                }
            })

            .state('tab.display_map', {
                // used by search by name
                url: '/display_map',
                views: {
                    'tab-search_by_name' : {
                        templateUrl: 'templates/map_page.html',
                        controller: 'MapPageCtrl'
                    }
                }
            })

            .state('tab.search_by_act_display_map', {
                // used by activities
                url: '/search_by_acts/display_map',
                views: {
                    'tab-activities' : {
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

            .state('tab.activities_page', {
                url: '/activities',
                views: {
                    'tab-activities' : {
                        templateUrl: 'templates/activity_page.html',
                        controller: 'ActivityPageCtrl'
                    }
                }
            })

            .state('tab.terms_of_use',{
                url: '/terms_of_use',
                views: {
                    'tab-terms_of_use' : {
                        templateUrl: 'templates/terms_of_use.html',
                        controller: 'TermCtrl'
                    }
                }

            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/index');

    });



