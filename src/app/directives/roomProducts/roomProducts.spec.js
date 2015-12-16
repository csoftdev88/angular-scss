'use strict';

describe('RoomProducts', function() {
  var TEMPLATE = '<room-products></room-products>';
  var TEMPLATE_URL = 'directives/roomProducts/roomProducts.html';
  var TEMPLATE_CONTENT = '<div>room products</div>';

  var TEST_ROOM_PRODUCTS = {
    products: [
      {
        code: 123,
        name: 'test',
        price: {
          totalBase: 20
        }
      }
    ]
  };

  var _rootScope, _scope, _elem, _templateCache, _spyTemplateCacheGet,
    _spyStateGo, _dataLayerService;

  beforeEach(function() {
    module('underscore');

    module('mobiusApp.directives.room.products', function($provide){
      $provide.value('filtersService', {});

      $provide.value('bookingService', {
        getAPIParams: function(){
          return {
            productGroupId: 1
          };
        },
        getCodeFromSlug: function(){}
      });

      $provide.value('stateService', {
        isMobile: function(){
          return true;
        }
      });

      $provide.value('cookieFactory', function(a){return {}[a];});

      $provide.value('propertyService', {
        getRoomProducts: function(){
          return {
            then: function(c){
              return c(TEST_ROOM_PRODUCTS);
            }
          };
        }
      });

      $provide.value('$state', {
        go: function(){}
      });

      $provide.value('$stateParams', {});

      $provide.value('Settings', {
        UI: {
          generics: {
            loyaltyProgramEnabled: true
          },
          hotelDetails: {
            rooms: {
              rates: {
                bookNowButtonText: 'Book Now'
              }
            }
          },
          roomDetails: {
            hasReadMore: true
          }
        }
      });

      $provide.value('dataLayerService', {
        trackProductsDetailsView: sinon.spy(),
        trackProductsImpressions: sinon.spy(),
        trackProductClick: sinon.spy()
      });

      $provide.value('modalService', {
        openProductDetailsDialog: sinon.spy()
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache,
      $state, modalService, dataLayerService) {
    _rootScope = $rootScope.$new();
    _templateCache = $templateCache;
    _templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    // Spy's
    _spyTemplateCacheGet = sinon.spy(_templateCache, 'get');

    _spyStateGo = sinon.spy($state, 'go');

    _dataLayerService = dataLayerService;

    // Final component compile
    // Data on parent scope
    _rootScope.details = {
      meta: {
        slug: 'hotelCode'
      }
    };

    _rootScope.room = {
      meta: {
        slug: 'roomCode'
      }
    };

    _elem = $compile(TEMPLATE)(_rootScope);
    _rootScope.$digest();
    _scope = _elem.scope();
  }));

  afterEach(function() {
    _spyTemplateCacheGet.restore();
    _spyStateGo.restore();
  });

  describe('when component is initialized', function() {
    it('should download widget template from template cache', function() {
      expect(_spyTemplateCacheGet.calledOnce).equal(true);
      expect(_spyTemplateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should compile widget template', function() {
      expect(_elem.html()).equal(TEMPLATE_CONTENT);
    });

    it('should download room products from the server', function(){
      expect(_scope.products).equal(TEST_ROOM_PRODUCTS.products);
    });

    it('should send product impressions once products are displayed', function(){
      expect(_dataLayerService.trackProductsImpressions.calledOnce).equal(true);
      expect(_dataLayerService.trackProductsImpressions.calledWith([{
        code: 123,
        name: 'test',
        price: 20
      }])).equal(true);
    });
  });

  describe('openProductDetailsDialog', function(){
    it('should track product details view in data layer', function(){
      var testProduct = {
        name: 'test',
        code: 123,
        price:{
          totalBase: 100
        }
      };

      _scope.openProductDetailsDialog(testProduct);

      expect(_dataLayerService.trackProductsDetailsView.calledOnce).equal(true);
      expect(_dataLayerService.trackProductsDetailsView.calledWith([{
          name: 'test',
          code: 123,
          price: 100
        }])).equal(true);
    });
  });

  describe('selectProduct', function(){
    it('should redirect to reservation details state', function(){
      _scope.selectProduct('testRoom', 'testProduct', false, 10, {
        preventDefault: function(){},
        stopPropagation: function(){}
      });
      expect(_spyStateGo.calledOnce).equal(true);
      expect(_spyStateGo.calledWith('reservation.details')).equal(true);
    });
  });
});
