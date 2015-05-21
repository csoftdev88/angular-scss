'use strict';

describe('mobius.controllers.hotel.details', function() {
  describe('HotelDetailsCtrl', function() {
    var _scope, _spyBookingServiceGetAPIParams,
      _spyPropertyServiceGetPropertyDetails;

    var HOTEL_DETAILS = {
      nameShort: 'Mobius hotel'
    };

    beforeEach(function() {
      module('mobius.controllers.hotel.details', function($provide) {
        $provide.value('bookingService', {
            getAPIParams: function(){
              return {
                productGroupId: 123,
                'test': 'testValue'
              };
            }
          });

        $provide.value('propertyService', {
            getPropertyDetails: function(){
              return {
                then: function(c){
                  c(HOTEL_DETAILS);
                }
              };
            }
          });
      });
    });

    beforeEach(inject(function($controller, $rootScope, bookingService,
      propertyService) {
      _scope = $rootScope.$new();
      // Spy's
      _spyBookingServiceGetAPIParams = sinon.spy(bookingService, 'getAPIParams');
      _spyPropertyServiceGetPropertyDetails = sinon.spy(
        propertyService, 'getPropertyDetails');

      $controller('HotelDetailsCtrl', { $scope: _scope });
    }));

    afterEach(function() {
      _spyBookingServiceGetAPIParams.restore();
      _spyPropertyServiceGetPropertyDetails.restore();
    });

    describe('when controller is initialized', function() {
      it('should get settings from bookingService', function() {
        expect(_spyBookingServiceGetAPIParams.calledOnce).equal(true);
      });

      it('should download hotel details from the server', function() {
        expect(_spyPropertyServiceGetPropertyDetails.calledOnce).equal(true);
        expect(_spyPropertyServiceGetPropertyDetails
          .calledWith(123, {'test': 'testValue'})
          ).equal(true);
      });

      it('should define download data on scope', function() {
        expect(_scope.details).equal(HOTEL_DETAILS);
      });
    });
  });
});