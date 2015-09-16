/**
 * Created by jupiterli on 15/09/2015.
 */

"use strict";

describe('googleMapsService', function() {
    beforeEach(module('trails_app'));

    var googleMapsService;

    beforeEach(inject(function(_googleMapsService_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        googleMapsService = _googleMapsService_;
    }));

        it('sets the strength to "strong" if the password length is >8 chars', function() {
            expect(googleMapsService.getGoogleMap()).type(google.maps.Map) ;

    });
});