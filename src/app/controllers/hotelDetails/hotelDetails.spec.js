'use strict';
/*jshint -W030 */

describe('mobius.controllers.hotel.details', function() {
  describe('HotelDetailsCtrl', function() {
    var _scope, _spyBookingServiceGetAPIParams,
      _spyPropertyServiceGetPropertyDetails, _spyFiltersServiceGetBestRateProduct,
      _spyUpdateHeroContent, _spyPropertyServiceGetRooms;

    var HOTEL_DETAILS = {
      nameShort: 'Mobius hotel',
      images: [
        {
          uri: 'http://testimage'
        }
      ],
      long: 'testLong',
      lat: 'testLat'
    };

    var ROOMS = [];

    beforeEach(function() {
      module('mobiusApp.factories.preloader');

      module('mobius.controllers.hotel.details', function($provide) {
        $provide.value('bookingService', {
            getAPIParams: function(){
              return {
                'test': 'testValue',
                'property': 123
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
            },
            getRooms: function(){
              return {
                then: function(c){
                  c(ROOMS);
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

        $provide.value('modalService', {});
        $provide.value('$state', {
          go: function(){}
        });

        var breadcrumbs = {
          addBreadCrumb: function(){ return breadcrumbs; },
          addHref: function(){ return breadcrumbs; }
        };
        $provide.value('breadcrumbsService', breadcrumbs);
      });
    });

    beforeEach(inject(function($controller, $rootScope, bookingService,
      propertyService, filtersService) {
      _scope = $rootScope.$new();
      // Spy's
      _spyBookingServiceGetAPIParams = sinon.spy(bookingService, 'getAPIParams');
      _spyPropertyServiceGetPropertyDetails = sinon.spy(
        propertyService, 'getPropertyDetails');
      _spyPropertyServiceGetRooms = sinon.spy(
        propertyService, 'getRooms');

      _spyFiltersServiceGetBestRateProduct = sinon.spy(filtersService, 'getBestRateProduct');
      _scope.updateHeroContent = function(){};
      _spyUpdateHeroContent = sinon.spy(_scope, 'updateHeroContent');

      $controller('HotelDetailsCtrl', { $scope: _scope });
    }));

    afterEach(function() {
      _spyBookingServiceGetAPIParams.restore();
      _spyPropertyServiceGetPropertyDetails.restore();
      _spyPropertyServiceGetRooms.restore();
      _spyFiltersServiceGetBestRateProduct.restore();
      _spyUpdateHeroContent.restore();
    });

    describe('when controller is initialized', function() {
      it('should get settings from bookingService', function() {
        expect(_spyBookingServiceGetAPIParams.calledOnce).equal(true);
      });

      it('should get best available rate details from filtersService', function() {
        expect(_spyFiltersServiceGetBestRateProduct.calledOnce).equal(true);
      });

      it('should download hotel details from the server with BAR id', function() {
        expect(_spyPropertyServiceGetPropertyDetails).to.be.calledOnce;
        expect(_spyPropertyServiceGetPropertyDetails
            .calledWith(123, {'test': 'testValue', productGroupId: 321, includes: 'amenities'})
        ).equal(true);
        expect(_spyPropertyServiceGetRooms).to.be.calledOnce;
        expect(_spyPropertyServiceGetRooms
            .calledWith(123)
        ).equal(true);
      });

      it('should define download data on scope', function() {
        expect(_scope.details).equal(HOTEL_DETAILS);
      });

      it('should update hero images when previewImages are provided', function() {
        expect(_spyUpdateHeroContent.calledOnce).equal(true);
        expect(_spyUpdateHeroContent.calledWith([{image: 'http://testimage'}])).equal(true);
      });
    });
  });
});