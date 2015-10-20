/**
 * Created by jupiterli on 7/10/2015.
 */


trails_app.
    factory('overlappingMarkerSpiderfyService', function () {
        var oms;



        var clear = function(){
            console.log("overlappingMarkerSpiderfyService: Start to clear it");

            if (oms != undefined){
                oms.clearMarkers();
                oms.clearListeners("mousedown");
                oms.clearListeners("spiderfy");
                oms.clearListeners("unspiderfy");
                console.log("overlappingMarkerSpiderfyService: Succeed to clear it");

            } else{
                console.log("overlappingMarkerSpiderfyService: Failed to clear it as it is not initialized yet");

            }
        };


        var initial = function(google_map, markers, iw, $scope, $compile){
            console.log("overlappingMarkerSpiderfyService: Start to initialize it with " + markers.length + " markers");


            oms = new OverlappingMarkerSpiderfier(google_map);



            console.log("overlappingMarkerSpiderfyService: Add mouse down event to all marker");
            oms.addListener('mousedown', function(marker) {
                console.log('overlappingMarkerSpiderfyService: mousedown event');
                /*if (marker.getTitle() == "" || marker.getTitle() == undefined){
                    // title is not defined
                    marker.infoWindow.open(google_map, marker);
                } else {*/

                console.log('overlappingMarkerSpiderfyService: Initialized google info window');

                iw.setContent(marker.getTitle());

                console.log('overlappingMarkerSpiderfyService: compile content in info window when it is ready to be compiled');
                    google.maps.event.addListener(iw, 'domready', function() {
                        $scope.$apply(function(){
                            $compile(document.getElementById("markerTitle"))($scope);
                        });
                    });

                console.log('overlappingMarkerSpiderfyService: info window open');

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
            console.log("overlappingMarkerSpiderfyService: Add spiderfy event to all marker");

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
            console.log("overlappingMarkerSpiderfyService: Add unspiderfy event to all marker");
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
            console.log("overlappingMarkerSpiderfyService: Succeed to initialize it");

        };

        return{
            initial : initial,
            clear : clear
        }
    });