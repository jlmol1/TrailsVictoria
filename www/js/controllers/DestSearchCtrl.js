/**
 * Created by jupiterli on 17/09/2015.
 */

trails_app.controller('DestSearchCtrl', function(
    $scope,
    googleMapsService,
    searchService,
    cacheDataService,
    loadingService) {

    // collect user input for search, des address
    $scope.keyword = {};

    // initialize google map
    var google_map = googleMapsService.createAGoogleMapByName("dest_search_map");

    $scope.doSearch = function() {
        loadingService.startLoading();
        console.log("starting search on des");
        searchService.searchOnDestination(google_map, $scope.keyword.address, googleMapsService, cacheDataService);
        loadingService.finishLoading();
    }


});
