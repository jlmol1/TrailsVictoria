/**
 * Created by jupiterli on 22/09/2015.
 */



trails_app.

    factory('preferencesDataService', function($localStorage) {
        // preferences data
        var preData = {
            isPrecise : false,
            searchRadius : 100
        };

        function updateData() {
            $localStorage.preData = preData;
            console.log("preferencesDataService: store to localStorage prefer data", preData);
        }

        function getData() {
            preData = $localStorage.preData;
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
                if ($localStorage.hasOwnProperty('preData')) {
                    getData();
                } else {
                    console.log("preferencesDataService: initial prefer data", preData);
                    updateData();
                }

            }
        }
    });