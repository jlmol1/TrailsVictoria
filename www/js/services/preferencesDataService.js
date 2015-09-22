/**
 * Created by jupiterli on 22/09/2015.
 */



trails_app.

    factory('preferencesDataService', function($window) {
        // preferences data
        var preData = {
            isPrecise : false,
            searchRadius : 100
        };

        function updateData() {
            $window.localStorage.setItem("preData", JSON.stringify(preData));
            console.log("preferencesDataService: store to localStorage prefer data", preData);
        }

        function getData() {
            preData = JSON.parse($window.localStorage.getItem("preData"));
            console.log("preferencesDataService: get from localStorage prefer data", preData);
        }

        return{
            getSeachRadius : function() {
                getData();
                console.log("preferencesDataService: get prefer data searchRadius", preData.searchRadius);
                return preData.searchRadius;
            },
            setSearchRadius : function(value) {
                preData.searchRadius = value;
                console.log("preferencesDataService: set prefer data searchRadius", preData.searchRadius);
                updateData();
            },
            getIsPrecise : function() {
                getData();
                console.log("preferencesDataService: get prefer data IsPrecise", preData.isPrecise);
                return preData.isPrecise;
            },
            setIsPrecise : function(value) {
                preData.isPrecise = value;
                console.log("preferencesDataService: set prefer data IsPrecise to ", preData.isPrecise);
                updateData();
            },
            init : function() {
                if (($window.localStorage['preData']).isPrecise == null) {
                    console.log("preferencesDataService: initial prefer data", preData);
                    updateData();
                } else {
                    getData();
                }

            }
        }
    });