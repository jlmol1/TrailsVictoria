/**
 * Created by jupiterli on 8/10/2015.
 */


trails_app.

    factory('MarkerClusterService', function(){
        var markerClusterer;

        var clear = function(){
            if (markerClusterer != undefined){
                markerClusterer.clearMarkers();
            }
        };

        var initial = function(google_map, markers){
            markerClusterer = new MarkerClusterer(google_map, markers);
        };

        return{
            clear : clear,
            initial : initial
        }
    });