'use strict';

describe('reservationData', function() {
  var _$rootScope, _scope, _$compile, _elem,
    _$templateCache, _templateCacheGet, _clock;

  var TEMPLATE = '<reservation-data />';
  var TEMPLATE_URL = 'directives/reservationData/reservationData.html';

  beforeEach(function() {
    module('underscore');
    module('mobiusApp.directives.reservation.data');
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    _$templateCache = $templateCache;
    _$templateCache.put(TEMPLATE_URL, '');

      // Spy's
    _templateCacheGet = sinon.spy(_$templateCache, 'get');
  }));

  afterEach(function(){
    _templateCacheGet.restore();
    _clock.restore();
  });

  describe('when directive is initialized', function() {
    beforeEach(function() {
      _elem = _$compile(TEMPLATE)(_$rootScope);
      _$rootScope.$digest();
      _scope = _elem.isolateScope();
      _clock = sinon.useFakeTimers(0 , 'Date');
    });

    it('should get directives template form template cache)', function() {
      expect(_templateCacheGet.calledOnce).equal(true);
      expect(_templateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should not insert any template into a parent container', function() {
      expect(_elem.html()).equal('');
    });
  });

  describe('getCheckInDateString', function(){
    it('should be defined as a function', function() {
      expect(_scope.getCheckInDateString).to.be.a('function');
    });

    it('should return day name if the check in date is within the next 7 days', function() {
      _clock.tick(window.moment('2015-01-01T10:53:35+0000').valueOf());

      _scope.reservation = {
        arrivalDate: '2015-01-02'
      };

      //expect(_scope.getCheckInDateString()).equal('Mo');
    });
  });
});
