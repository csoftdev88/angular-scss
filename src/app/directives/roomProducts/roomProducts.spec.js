'use strict';

describe('RoomProducts', function() {
  var TEMPLATE = '<room-products></room-products>';
  var TEMPLATE_URL = 'directives/roomProducts/roomProducts.html';
  var TEMPLATE_CONTENT = '<div>room products</div>';

  var TEST_ROOM_PRODUCTS = [
    {
      productId: 123
    }
  ];

  var _rootScope, _scope, _elem, _templateCache, _spyTemplateCacheGet,
    _spyOpenPoliciesInfo;

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
          roomDetails: {
            hasReadMore: true
          }
        }
      });

      $provide.value('modalService', {
        openRoomDetailsDialog: function(){},
        openPoliciesInfo: function(){}
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache,
      modalService) {
    _rootScope = $rootScope.$new();
    _templateCache = $templateCache;
    _templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    // Spy's
    _spyTemplateCacheGet = sinon.spy(_templateCache, 'get');
    _spyOpenPoliciesInfo = sinon.spy(modalService, 'openPoliciesInfo');

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
    _spyOpenPoliciesInfo.restore();
  });

  describe('when component is initialized', function() {
    it('should download widget template from template cache', function() {
      expect(_spyTemplateCacheGet.calledOnce).equal(true);
      expect(_spyTemplateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should compile widget template', function() {
      expect(_elem.html()).equal(TEMPLATE_CONTENT);
    });
  });

  describe('openRoomDetailsDialog', function(){
    it('should be defined as a function on scope according to settings in config', function(){
      expect(_scope.openRoomDetailsDialog).to.be.a('function');
    });
  });

  describe('openPoliciesInfo', function(){
    it('should open policies modal dialog', function(){
      var testObj = {test: 123};

      _scope.openPoliciesInfo(testObj);
      expect(_spyOpenPoliciesInfo.calledOnce).equal(true);
      expect(_spyOpenPoliciesInfo.calledWith(testObj)).equal(true);
    });
  });


  describe('getProductName', function(){
    it('should return first word of a product name', function(){
      expect(_scope.getProductName('testname')).equal('testname');
      expect(_scope.getProductName('test name')).equal('test');
    });
  });

  describe('getProductSuffix', function(){
    it('should return product name without the first word', function(){
      expect(_scope.getProductSuffix('testname')).equal('');
      expect(_scope.getProductSuffix('test name')).equal('name');
    });
  });
});
