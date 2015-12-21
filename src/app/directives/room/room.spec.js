'use strict';

describe('room', function() {
  var _$rootScope, _scope, _$compile, _elem,
    _$templateCache, _$q,_templateCacheGet, _filtersService, _propertyService,
    _breadcrumbsService, _modalService;

  var TEMPLATE = '<room/>';
  var TEMPLATE_URL = 'directives/room/room.html';

  var ROOM_DATA = {
    roomDetails: {
      meta: {
        microdata: {
          og: 'og'
        }
      }
    },
    roomProductDetails: {}
  };

  var PROPERTY_DATA = {};

  beforeEach(function() {
    module('underscore');

    module('mobiusApp.factories.preloader');

    module('mobiusApp.directives.room', function($provide, $controllerProvider) {
      // Mocking the services
      $provide.value('$stateParams', {
        roomSlug: 'ROOM-CODE'
      });
      $provide.value('$state', {});
      $provide.value('Settings', {
        UI: {
          'generics' : {
            'loyaltyProgramEnabled': true
          },
          'roomDetails': {
            'hasReadMore': true
          },
          'hotelDetails': {
            'rooms':{
              'sortRoomsByWeighting': true
            }
          }
        }
      });
      $provide.value('scrollService', {});
      $provide.value('cookieFactory', function(a){return {}[a];});

      $provide.value('dataLayerService', {
        trackProductsDetailsView: sinon.spy()
      });

      $provide.value('breadcrumbsService', {
        clear: sinon.stub(),
        addBreadCrumb: sinon.stub()
      });

      $provide.value('user', {
        getCustomerId: sinon.stub(),
        getUser: sinon.stub(),
        loadLoyalties: sinon.stub()
      });

      $provide.value('metaInformationService', {
        setMetaDescription: sinon.spy(),
        setMetaKeywords: sinon.spy(),
        setPageTitle: sinon.spy(),
        setOgGraph: sinon.spy()
      });

      $provide.value('bookingService', {
        getAPIParams: function(){
          return {
            code: 123,
            propertySlug: 'PROPERTY-CODE',
            roomSlug: 'ROOM-CODE'
          };
        },
        getCodeFromSlug: function(c){
          return c;
        }
      });
      $provide.value('propertyService', {
        getPropertyDetails: sinon.stub(),
        getRooms: sinon.stub(),
        getRoomDetails: sinon.stub()
      });

      $provide.value('filtersService', {
        getBestRateProduct: sinon.stub()
      });

      $provide.value('modalService', {
        openAssociatedRoomDetail: sinon.spy()
      });

      $controllerProvider.register('PriceCtr', function($scope){
        $scope._priceCtrlInherited = true;
      });
      $controllerProvider.register('RatesCtrl', function($scope){
        $scope._ratesCtrlInherited = true;
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache, $q, filtersService,
      propertyService, breadcrumbsService, modalService) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    _$templateCache = $templateCache;
    _$templateCache.put(TEMPLATE_URL, '<p>room</p>');

    _$q = $q;

      // Spy's
    _templateCacheGet = sinon.spy(_$templateCache, 'get');

    _propertyService = propertyService;
    _propertyService.getPropertyDetails.returns($q.when(PROPERTY_DATA));
    _propertyService.getRooms.returns($q.when([]));
    _propertyService.getRoomDetails.returns($q.when([]));

    _breadcrumbsService = breadcrumbsService;
    _breadcrumbsService.clear.returns(_breadcrumbsService);
    _breadcrumbsService.addBreadCrumb.returns(_breadcrumbsService);

    _filtersService = filtersService;
    _filtersService.getBestRateProduct.returns($q.when());

    _modalService = modalService;


    // Initialization
    _elem = _$compile(TEMPLATE)(_$rootScope);
    _$rootScope.getRoomData = sinon.stub().returns(_$q.when(ROOM_DATA));
    _$rootScope.setRoomDetails = sinon.spy();

    _$rootScope.$digest();
    _scope = _elem.isolateScope();
  }));

  afterEach(function(){
    _templateCacheGet.restore();
  });

  describe('when directive is initialized', function() {
    it('should get directives template form template cache)', function() {
      expect(_templateCacheGet.calledOnce).equal(true);
      expect(_templateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should insert template content into a parent element', function() {
      expect(_elem.html()).equal('<p>room</p>');
    });

    it('should download room details from the server', function(){
      expect(_$rootScope.getRoomData.calledOnce).equal(true);
      expect(_$rootScope.getRoomData.calledWith('PROPERTY-CODE', 'ROOM-CODE')).equal(true);
    });

    it('should set downloaded room data on scope via parent controller', function(){
      expect(_$rootScope.setRoomDetails.calledOnce).equal(true);
    });

    /*
    it('should inherit PriceCtr', function() {
      expect(_scope._priceCtrlInherited).equal(true);
    });

    it('should inherit RatesCtrl', function() {
      expect(_scope._ratesCtrlInherited).equal(true);
    });
    */
  });
});
