'use strict';
/*jshint -W030 */

describe('mobius.controllers.hotel.details', function() {
  describe('HotelDetailsCtrl', function() {
    var _scope, _spyBookingServiceGetAPIParams,
      _spyPropertyServiceGetPropertyDetails, _spyFiltersServiceGetBestRateProduct,
      _spyUpdateHeroContent, _spyPropertyServiceGetRooms,
      _spyModalServiceOpenGallery;

    var HOTEL_DETAILS = {
      nameShort: 'Mobius hotel',
      images: [
        {
          uri: 'http://testimage',
          includeInSlider: true
        }
      ],
      long: 'testLong',
      lat: 'testLat'
    };

    var ROOMS = [];
    var TEST_OFFERS = [];

    beforeEach(function() {
      module('mobiusApp.factories.preloader');

      module('mobius.controllers.hotel.details', function($provide, $controllerProvider) {
        $provide.value('bookingService', {
            getAPIParams: function(){
              return {
                'test': 'testValue',
                'propertyCode': 123
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

        $provide.value('modalService', {
          openGallery: function(){}
        });

        $provide.value('advertsService', {});
        $provide.value('scrollService', {});

        $provide.value('$state', {
          go: function(){}
        });

        $provide.value('contentService', {
          getOffers: function() {
            return {
              then: function(c) {
                c(TEST_OFFERS);
              }
            };
          }
        });

        var breadcrumbs = {
          addBreadCrumb: function(){ return breadcrumbs; },
          addHref: function(){ return breadcrumbs; },
          removeHref: function(){ return breadcrumbs; }
        };
        $provide.value('breadcrumbsService', breadcrumbs);


        $controllerProvider.register('PriceCtr', function(){});
      });
    });

    beforeEach(inject(function($controller, $rootScope, bookingService,
      propertyService, filtersService, modalService) {
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
      _spyModalServiceOpenGallery = sinon.spy(modalService, 'openGallery');

      $controller('HotelDetailsCtrl', { $scope: _scope });
    }));

    afterEach(function() {
      _spyBookingServiceGetAPIParams.restore();
      _spyPropertyServiceGetPropertyDetails.restore();
      _spyPropertyServiceGetRooms.restore();
      _spyFiltersServiceGetBestRateProduct.restore();
      _spyUpdateHeroContent.restore();
      _spyModalServiceOpenGallery.restore();
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
            .calledWith(123, {'test': 'testValue', productGroupId: 321, includes: 'amenities', propertyCode: 123})
        ).equal(true);
        expect(_spyPropertyServiceGetRooms).to.be.calledOnce;
        expect(_spyPropertyServiceGetRooms
            .calledWith(123)
        ).equal(true);
      });

      it('should define download data on scope', function() {
        expect(_scope.details).equal(HOTEL_DETAILS);
        expect(_scope.offersList).deep.equal(TEST_OFFERS);
      });

      it('should update hero images when previewImages are provided', function() {
        expect(_spyUpdateHeroContent.calledOnce).equal(true);
        expect(_spyUpdateHeroContent.calledWith([{uri: 'http://testimage',
          includeInSlider: true}])).equal(true);
      });
    });

    describe('openGallery', function(){
      it('should invoke openGallery function on modalService with a list of images', function() {
        _scope.openGallery();
        expect(_spyModalServiceOpenGallery.calledOnce).equal(true);
        expect(_spyModalServiceOpenGallery.calledWith(['http://testimage'])).equal(true);
      });
    });
  });
});