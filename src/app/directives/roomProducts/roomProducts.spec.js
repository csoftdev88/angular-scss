'use strict';

describe('RoomProducts', function() {
  var TEMPLATE = '<room-products></room-products>';
  var TEMPLATE_URL = 'directives/roomProducts/roomProducts.html';
  var TEMPLATE_CONTENT = '<div>room products</div>';

  var TEST_ROOM_PRODUCTS = {
    data: {
      products: [
        {code: 123}
      ]
    }
  };

  var _rootScope, _scope, _elem, _templateCache, _spyTemplateCacheGet,
    _spyOpenPoliciesInfo, _spyOpenRoomDetailsDialog, _spyOpenPriceBreakdownInfo,
    _spyStateGo;

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
        openPoliciesInfo: function(){},
        openPriceBreakdownInfo: function(){}
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache,
      $state, modalService) {
    _rootScope = $rootScope.$new();
    _templateCache = $templateCache;
    _templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    // Spy's
    _spyTemplateCacheGet = sinon.spy(_templateCache, 'get');
    _spyOpenPoliciesInfo = sinon.spy(modalService, 'openPoliciesInfo');
    _spyOpenRoomDetailsDialog = sinon.spy(modalService, 'openRoomDetailsDialog');
    _spyOpenPriceBreakdownInfo = sinon.spy(modalService, 'openPriceBreakdownInfo');
    _spyStateGo = sinon.spy($state, 'go');

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
    _spyOpenRoomDetailsDialog.restore();
    _spyOpenPriceBreakdownInfo.restore();
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
  });

  describe('openRoomDetailsDialog', function(){
    it('should be defined as a function on scope according to settings in config', function(){
      expect(_scope.openRoomDetailsDialog).to.be.a('function');
    });

    it('should open room details dialog', function(){
      var testObj = {test: 123};

      _scope.openRoomDetailsDialog(testObj);
      expect(_spyOpenRoomDetailsDialog.calledOnce).equal(true);
      expect(_spyOpenRoomDetailsDialog.calledWith(testObj)).equal(true);
    });
  });

  describe('openPriceBreakdownInfo', function(){
    it('should be defined as a function on scope', function(){
      expect(_scope.openPriceBreakdownInfo).to.be.a('function');
    });

    it('should open price breakdown dialog', function(){
      _scope.openPriceBreakdownInfo();
      expect(_spyOpenPriceBreakdownInfo.calledOnce).equal(true);
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

  describe('selectProduct', function(){
    it('should redirect to reservation details state', function(){
      _scope.selectProduct('testRoom', 'testProduct');
      expect(_spyStateGo.calledOnce).equal(true);
      expect(_spyStateGo.calledWith('reservation.details')).equal(true);
    });
  });
});
