'use strict';

describe('hotels directive', function() {
  var TEMPLATE = '<hotels></hotels>';
  var TEMPLATE_URL = 'directives/hotels/hotels.html';

  var TEST_URL_PARAMS = {testParam: 'testValue'};

  var PROPERTY_LIST = [
    {
      id: 1,
      name: 'TestHotel'
    }
  ];

  var _rootScope, _scope, _templateCache, _spyTemplateCacheGet,
    _spyStateGo, _spyBookingServiceGetAPIParams, _propertyServiceGetAll;

  beforeEach(function() {
    module('mobiusApp.directives.hotels', function($provide) {
      // Mocking the services
      $provide.value('bookingService', {
        getAPIParams: function(){
          return TEST_URL_PARAMS;
        }
      });

      $provide.value('propertyService', {
        getAll: function(){
          return {
            then: function(c){
              c(PROPERTY_LIST);
            }
          };
        }
      });

      $provide.value('$state', {
        go: function(){}
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $state, $templateCache,
      bookingService, propertyService) {
    _rootScope = $rootScope.$new();

    _templateCache = $templateCache;
    _templateCache.put(TEMPLATE_URL, '');
    // Spy's
    _spyTemplateCacheGet = sinon.spy(_templateCache, 'get');
    _spyStateGo = sinon.spy($state, 'go');
    _spyBookingServiceGetAPIParams = sinon.spy(bookingService, 'getAPIParams');
    _propertyServiceGetAll = sinon.spy(propertyService, 'getAll');
    // Final component compile
    var elem = $compile(TEMPLATE)(_rootScope);
    _rootScope.$digest();
    _scope = elem.isolateScope();
  }));

  afterEach(function() {
    _spyTemplateCacheGet.restore();
    _spyStateGo.restore();
    _spyBookingServiceGetAPIParams.restore();
    _propertyServiceGetAll.restore();
  });

  describe('when component is initialized', function() {
    it('should download widget template from template cache', function() {
      expect(_spyTemplateCacheGet.calledOnce).equal(true);
      expect(_spyTemplateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should read booking settings from the URL excluding property details', function() {
      expect(_spyBookingServiceGetAPIParams.calledOnce).equal(true);
      expect(_spyBookingServiceGetAPIParams.calledWith(true)).equal(true);
    });

    it('should download a list of properties from the server based on the settings in the URL', function() {
      expect(_propertyServiceGetAll.calledOnce).equal(true);
      expect(_propertyServiceGetAll.calledWith(TEST_URL_PARAMS)).equal(true);
    });

    it('should define hotels on the scope ', function() {
      expect(_scope.hotels).equal(PROPERTY_LIST);
    });
  });

  describe('navigateToHotel', function() {
    it('should redirect to hotel details page', function() {
      _scope.navigateToHotel(123);
      expect(_spyStateGo.calledOnce).equal(true);
      expect(_spyStateGo.calledWith('hotel', {hotelID: 123})).equal(true);
    });
  });
});
