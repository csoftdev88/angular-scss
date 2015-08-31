'use strict';

describe('room', function() {
  var _$rootScope, _scope, _$compile, _elem,
    _$templateCache, _$q,_templateCacheGet, _filtersService, _propertyService,
    _breadcrumbsService;

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
      $provide.value('$stateParams', {});
      $provide.value('$state', {});
      $provide.value('Settings', {
        UI: {
          'roomDetails': {
            'hasReadMore': true
          }
        }
      });
      $provide.value('scrollService', {});

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
            code: 123
          };
        },
        getCodeFromSlug: function(c){
          return c;
        }
      });
      $provide.value('propertyService', {
        getPropertyDetails: sinon.stub(),
        getRooms: sinon.stub()
      });

      $provide.value('filtersService', {
        getBestRateProduct: sinon.stub()
      });

      $provide.value('modalService', {});

      $controllerProvider.register('PriceCtr', function(){});
      $controllerProvider.register('RatesCtrl', function(){});
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache, $q, filtersService,
      propertyService, breadcrumbsService) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    _$templateCache = $templateCache;
    _$templateCache.put(TEMPLATE_URL, '');

    _$q = $q;

      // Spy's
    _templateCacheGet = sinon.spy(_$templateCache, 'get');

    _propertyService = propertyService;
    _propertyService.getPropertyDetails.returns($q.when(PROPERTY_DATA));
    _propertyService.getRooms.returns($q.when([]));

    _breadcrumbsService = breadcrumbsService;
    _breadcrumbsService.clear.returns(_breadcrumbsService);
    _breadcrumbsService.addBreadCrumb.returns(_breadcrumbsService);

    _filtersService = filtersService;
    _filtersService.getBestRateProduct.returns($q.when());
  }));

  afterEach(function(){
    _templateCacheGet.restore();
  });

  describe('when directive is initialized', function() {
    beforeEach(function() {
      _elem = _$compile(TEMPLATE)(_$rootScope);
      _$rootScope.getRoomData = sinon.stub().returns(_$q.when(ROOM_DATA));
      _$rootScope.setRoomDetails = sinon.spy();

      _$rootScope.$digest();
      _scope = _elem.isolateScope();
    });

    it('should get directives template form template cache)', function() {
      expect(_templateCacheGet.calledOnce).equal(true);
      expect(_templateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should not insert any template into a parent container', function() {
      expect(_elem.html()).equal('');
    });
  });
});
