'use strict';

describe('reservationDetails', function() {
  var _$rootScope, _scope, _$compile, _elem,
    _$templateCache, _templateCacheGet;

  var TEMPLATE = '<reservation-details />';
  var TEMPLATE_URL = 'directives/reservationData/details/reservationDetails.html';

  beforeEach(function() {
    module('underscore');
    module('mobius.controllers.reservation.directive', function($provide) {
      // Mocking the services

      var Settings = {
        'UI': {
          'reservations':{},
          'viewsSettings':{
            'reservationsOverview':{
              'fullWidthSections':false
            }
          }
        }
      };

      $provide.value('$state', {});
      $provide.value('Settings', Settings);
      $provide.value('stateService', {});
    });
    module('mobiusApp.directives.reservation.details', function($provide){
      $provide.value('$state', {});
    });
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
  });

  describe('when directive is initialized', function() {
    beforeEach(function() {
      _elem = _$compile(TEMPLATE)(_$rootScope);
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

    it('should inherit ReservationDirectiveCtrl', function() {
      expect(_scope.getAdultsCount).to.be.a('function');
      expect(_scope.getChildrenCount).to.be.a('function');
    });
  });
});