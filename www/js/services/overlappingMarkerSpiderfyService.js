/**
 * Created by jupiterli on 7/10/2015.
 */


trails_app.
    factory('overlappingMarkerSpiderfyService', function () {
        var oms;



        var clear = function(){
            if (oms != undefined){
                oms.clearMarkers();
                oms.clearListeners("mousedown");
                oms.clearListeners("spiderfy");
                oms.clearListeners("unspiderfy");
            }
        };


        var initial = function(google_map, markers, iw, $scope, $compile){
            oms = new OverlappingMarkerSpiderfier(google_map);



            oms.addListener('mousedown', function(marker) {
                console.log('mousedown event');
                /*if (marker.getTitle() == "" || marker.getTitle() == undefined){
                    // title is not defined
                    marker.infoWindow.open(google_map, marker);
                } else {*/
                    iw.setContent(marker.getTitle());

                    google.maps.event.addListener(iw, 'domready', function() {
                        $scope.$apply(function(){
                            $compile(document.getElementById("markerTitle"))($scope);
                        });
                    });

                    iw.open(google_map, marker);



                //}



                // below codes are used to highlight selected trail
                /*if ((cacheDataService.getTrailsByName(marker.getTitle())).length != 0){
                 var trail = (cacheDataService.getTrailsByName(marker.getTitle()))[0];
                    if (trail.focusTrail == undefined || trail.focusTrail == null){
                        trail.focusTrail = new google.maps.Polyline();
                        trail.focusTrail.setOptions({
                            map : google_map,
                            path : trail.google_poly[0].getPath(),
                            strokeColor : "yellow",
                            strokeOpacity : 0.6,
                            strokeWeight : 2,
                            zIndex : 100
                        });
                    }

                }*/
            });
            oms.addListener('spiderfy', function(markers) {
                console.log('spiderfy event');

                /*for (var i = 0; i < markers.length; i++){
                    if ((cacheDataService.getTrailsByName(markers[i].getTitle())).length != 0){
                        var trail = (cacheDataService.getTrailsByName(markers[i].getTitle()))[0];
                        trail.focusTrail.setMap(null);
                    }
                }*/

                iw.close();
            });
            oms.addListener('unspiderfy', function(markers) {
                console.log('unspiderfy event');

                /*for (var i = 0; i < markers.length; i++){
                    if ((cacheDataService.getTrailsByName(markers[i].getTitle())).length != 0){
                        var trail = (cacheDataService.getTrailsByName(markers[i].getTitle()))[0];
                        trail.focusTrail.setMap(null);
                    }
                }*/
            });

            for (var i = 0; i < markers.length; i++){

                oms.addMarker(markers[i]);
            }
        };

        return{
            initial : initial,
            clear : clear
        }
    });