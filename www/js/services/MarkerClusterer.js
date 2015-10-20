/**
 * Created by jupiterli on 8/10/2015.
 */


trails_app.

    factory('MarkerClusterService', function(){
        var markerClusterer;

        var clear = function(){
            console.log("MarkerClusterService: Start to clear it");
            if (markerClusterer != undefined){
                markerClusterer.clearMarkers();
                console.log("MarkerClusterService: Succeed to clear it");
            } else {
                console.log("MarkerClusterService: Failed to clear it as it is not initialized yet");
            }
        };

        var initial = function(google_map, markers){
            console.log("MarkerClusterService: Start to initialize, " + markers.length + " markers are going to be send to it", + markers);
            markerClusterer = new MarkerClusterer(google_map, markers);
            console.log("MarkerClusterService: Succeed to initialize marker cluster service ");
        };

        return{
            clear : clear,
            initial : initial
        }
    });