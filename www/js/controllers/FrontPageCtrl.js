/**
 * Created by jupiterli on 23/09/2015.
 */


trails_app.

    controller('FrontPageCtrl', function($scope, searchService, $state) {

        // initial search info
        $scope.search = {
            'time' : {
                min : 2,
                max : 8
            },
            'distance' : {
                min : 50,
                max : 300
            },
            'difficulty' : {
                min : "Moderate",
                max : "More difficulty"
            },
            'horse_riding' : false,
            'walking' : false,
            'cycling' : false,
            'mountain_biking' : false,
            activities : ''
        };

        $("#rangeTime").ionRangeSlider({
            hide_min_max: true,
            min: 0,
            max: 48,
            from: 2,
            to: 8,
            type: 'double',
            step: 1,
            postfix: "hrs",
            grid: true,
            onStart: function (data) {
                $scope.search.time.min = data.from;
                $scope.search.time.max = data.to;
                console.log("FrontPageCtrl: slider time finished, value is", $scope.search.time);
            },
            onChange: function (data) {
                $scope.search.time.min = data.from;
                $scope.search.time.max = data.to;
                console.log("FrontPageCtrl: slider time changed, value is", $scope.search.time);
            },
            onFinish: function (data) {
                $scope.search.time.min = data.from;
                $scope.search.time.max = data.to;
                console.log("FrontPageCtrl: slider time finished, value is", $scope.search.time);
            }
        });

        $("#rangeDistance").ionRangeSlider({
            hide_min_max: true,
            min: 0,
            max: 500,
            from: 50,
            to: 300,
            type: 'double',
            step: 1,
            postfix: "km",
            grid: true,
            onStart: function (data) {
                $scope.search.distance.min = data.from;
                $scope.search.distance.max = data.to;
                console.log("FrontPageCtrl: slider distance initialised, value is", $scope.search.distance);
            },
            onChange: function (data) {
                $scope.search.distance.min = data.from;
                $scope.search.distance.max = data.to;
                console.log("FrontPageCtrl: slider distance changed, value is", $scope.search.distance);
            },
            onFinish: function (data) {
                $scope.search.distance.min = data.from;
                $scope.search.distance.max = data.to;
                console.log("FrontPageCtrl: slider distance finished, value is", $scope.search.distance);
            }
        });

        $("#rangeDifficulty").ionRangeSlider({
            hide_min_max: true,
            values: [
                "Very easy",
                "Easy",
                "Moderate",
                "Difficult",
                "More difficult",
                "Very difficult"
            ],
            from: 3,
            to: 5,
            type: 'double',
            step: 1,
            grid: true,
            onStart: function (data) {
                $scope.search.difficulty = getDifficultiesString(data.from_value, data.to_value);
                console.log("FrontPageCtrl: slider diff initialised, value is", $scope.search.difficulty);
            },
            onChange: function (data) {
                $scope.search.difficulty = getDifficultiesString(data.from_value, data.to_value);
                console.log("FrontPageCtrl: slider diff changed, value is", $scope.search.difficulty);
            },
            onFinish: function (data) {
                $scope.search.difficulty = getDifficultiesString(data.from_value, data.to_value);
                console.log("FrontPageCtrl: slider diff finished, value is", $scope.search.difficulty);
            }
        });

        /**
         * return a string of several difficulties separated by ',' from start to end according level of difficulty
         */
        function getDifficultiesString(start, end){
            var allDifficultiesString = "Ungraded,Very easy,Easy,Moderate,Difficult,More difficult,Very difficult";

            return allDifficultiesString.slice(allDifficultiesString.indexOf(start), (allDifficultiesString.indexOf(end) + end.length));
        }

        $scope.searchByMul  = function () {
            // get search info
            // time, distance and difficulties are got by range sliders' listeners
            $scope.search.activities = "";
            if ($scope.search.horse_riding){
                $scope.search.activities += ",Horse Riding";
            }
            if ($scope.search.walking){
                $scope.search.activities += ",Walking";
            }
            if ($scope.search.cycling){
                $scope.search.activities += ",Cycling";
            }
            if ($scope.search.mountain_biking){
                $scope.search.activities += ",Mountain Biking";
            }
            //searchService.setActivities($scope.activities);
            //searchService.setDifficulty($scope.difficulty);
            //searchService.setDistance($scope.distance);
            //searchService.setTime($scope.time);
            // combine above together to simplify
            searchService.setMulSearchConditions($scope.search);
            console.log("FrontPageCtrl: start search, search conditions are ", $scope.search);
            searchService.setSearchOption("mul");
            $state.go("tab.map_page");
        };

    });