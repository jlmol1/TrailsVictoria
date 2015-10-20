/**
 * Created by Administrator on 2015/9/14.
 * This service can fetch weather conditions and create a google marker on the map
 *  with a meaningful icon.
 */

trails_app

    .factory('weatherService', function($http) {
        var getIconUrl = function (icon_id) {
            return "http://openweathermap.org/img/w/" + icon_id + ".png";
        };

        return {
            getWeather: function(map, trail, loadingService) {
                var lat = trail.min_lat;
                var lng = trail.mean_lon;
                var weather = { temp: {}, clouds: null, lat: null, lng: null };
                //loadingService.startLoading();
                $http.get('http://api.openweathermap.org/data/2.5/weather?APPID=4e21edb947657f98fa8634b6823a343a&lat=' + lat + '&lon=' + lng + '&units=metric').success(function(data) {
                    if (data) {
                        if (data.main) {

                            /*if (trail.weather_marker != null || trail.weather_marker != undefined){
                                // weather marker has been created before, no need to create a new one
                                trail.weather_marker.setPosition(new google.maps.LatLng(lat, lng));
                                trail.weather_marker.setTitle('current: ' + data.main.temp + '<br/> max: ' + data.main.temp_max + ', min: ' + data.main.temp_min);
                                trail.weather_marker.setIcon(getIconUrl(data.weather[0].icon));
                            } else {*/
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(lat, lng),
                                    animation: google.maps.Animation.DROP,
                                    title: 'current: ' + data.main.temp + '<br/> max: ' + data.main.temp_max + ', min: ' + data.main.temp_min,
                                    map: map,
                                    icon: getIconUrl(data.weather[0].icon)
                                });
                                trail.weather_marker = marker;
                                var iw1 = new google.maps.InfoWindow({
                                    content: '<img src=\'' + getIconUrl(data.weather[0].icon) + ' \' width=\'50%\' height=\'50%\'><br/>' +
                                    'current: ' + parseInt(data.main.temp) + '&#8451<br/> max: ' +
                                    parseInt(data.main.temp_max) + '&#8451, min: ' + parseInt(data.main.temp_min) + '&#8451<br/>' +
                                    data.weather[0].description
                                });
                                google.maps.event.addListener(marker, "mousedown", function (e) { iw1.open(map, this); });
                            //}

                            //google.maps.event.addListener(marker, "mouseout", function (e) {
                            //  iw1.close(map, this);
                            //});

                        }
                        weather.clouds = data.clouds ? data.clouds.all : undefined;
                        loadingService.finishLoading();
                        return weather;
                    }

                });

            }
        };
    });