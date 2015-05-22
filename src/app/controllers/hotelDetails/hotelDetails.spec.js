'use strict';

describe('mobius.controllers.hotel.details', function() {
  describe('HotelDetailsCtrl', function() {
    var _scope, _spyBookingServiceGetAPIParams,
      _spyPropertyServiceGetPropertyDetails, _spyFiltersServiceGetBestRateProduct;

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

        $provide.value('filtersService', {
          getBestRateProduct: function(){
            return {
              then: function(c){
                c({id: 321});
              }
            };
          }
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, bookingService,
      propertyService, filtersService) {
      _scope = $rootScope.$new();
      // Spy's
      _spyBookingServiceGetAPIParams = sinon.spy(bookingService, 'getAPIParams');
      _spyPropertyServiceGetPropertyDetails = sinon.spy(
        propertyService, 'getPropertyDetails');

      _spyFiltersServiceGetBestRateProduct = sinon.spy(filtersService, 'getBestRateProduct');

      $controller('HotelDetailsCtrl', { $scope: _scope });
    }));

    afterEach(function() {
      _spyBookingServiceGetAPIParams.restore();
      _spyPropertyServiceGetPropertyDetails.restore();
      _spyFiltersServiceGetBestRateProduct.restore();
    });

    describe('when controller is initialized', function() {
      it('should get settings from bookingService', function() {
        expect(_spyBookingServiceGetAPIParams.calledOnce).equal(true);
      });

      it('should get best available rate details from filtersService', function() {
        expect(_spyFiltersServiceGetBestRateProduct.calledOnce).equal(true);
      });

      it('should download hotel details from the server with BAR id', function() {
        expect(_spyPropertyServiceGetPropertyDetails.calledOnce).equal(true);
        expect(_spyPropertyServiceGetPropertyDetails
          .calledWith(123, {'test': 'testValue', productGroupId: 321})
          ).equal(true);
      });

      it('should define download data on scope', function() {
        expect(_scope.details).equal(HOTEL_DETAILS);
      });
    });
  });
});