/**
 * Created by jupiterli on 7/10/2015.
 */


trails_app.
    factory('overlappingMarkerSpiderfyService', function () {
        var oms;


        return{
            initial : function(google_map, markers) {
                oms = new OverlappingMarkerSpiderfier(google_map,
                    {markersWontMove: true, markersWontHider: true});

                //var iw = google.maps.InfoWindow();

                oms.addListener('click', function(marker) {
                    //iw.setContent(marker.getTitle());
                    //iw.open(google_map, marker);
                });
                oms.addListener('spiderfy', function(markers) {

                    //iw.close();
                });
                oms.addListener('unspiderfy', function(markers) {

                });

                for (var i = 0; i < markers.length; i++){

                    oms.addMarker(markers[i]);
                }

            }
        }
    });