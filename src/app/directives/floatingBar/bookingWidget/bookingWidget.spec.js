'use strict';
/*jshint -W030 */

describe('bookingWidget', function() {
  var env;

  var TEMPLATE = '<booking-widget></booking-widget>';
  var TEMPLATE_URL = 'directives/floatingBar/bookingWidget/bookingWidget.html';

  var TEST_REGION_LIST = [
    {code: 'TESTREG', nameShort: 'Test Region'}
  ];

  var TEST_LOCATION_LIST = [
    {code: 'TESTLOC', regionCode: 'TESTREG', nameShort: 'Test Location'}
  ];

  var TEST_PROPERTY_LIST = [
    {code: 'TESTPROP', regionCode: 'TESTREG', locationCode: 'TESTLOC', nameShort: 'Test Property'}
  ];

  var TEST_PRODUCTS_LIST = [

  ];

  var TEST_SETTINGS = {
    adults: {
      min: 1,
      max: 5
    },
    children: {
      max: 6
    },
    availability: {
      'from': {
        'value': -1,
        'type': 'month'
      },

      'to': {
        'value': 1,
        'type': 'month'
      }
    }
  };

  var TEST_AVAILABILITY = [
    {
      date: '2015-02-02',
      isInventory: true
    },
    {
      date: '2015-02-03',
      isInventory: false
    }
  ];

  var STATE_PARAMS = {
    property: 'TESTPROP',
    dates: '2015-02-02 2015-03-03',
    adults: 1
  };

  function setUp(settings){
    env = {};

    module('mobiusApp.directives.floatingBar.bookingWidget', function($provide, $controllerProvider) {
      // Mocking the services
      $provide.value('bookingService', {
        getParams: function(){
          return STATE_PARAMS;
        },
        getAPIParams: function(){
          return STATE_PARAMS;
        },
        datesFromString: function() {
          return {
            from: '2015-02-02',
            to: '2015-03-03'
          };
        }
      });

      $provide.value('queryService', {
        removeParam: function(){}
      });

      $provide.value('$state', {
        go: function(){}
      });

      $provide.value('validationService', {
        isValueValid: function(value){ return value ? true : false; },
        convertValue: function(value){ return value; }
      });

      $provide.value('propertyService', {
        getAll: function(){
          return {then: function(c){c(TEST_PROPERTY_LIST);}};
        },
        getAvailability: function(){
          return {then: function(c){c(TEST_AVAILABILITY);}};
        }
      });

      $provide.value('locationService', {
        getRegions: function(){
          return {then: function(c){c(TEST_REGION_LIST);}};
        },
        getLocations: function(){
          return {then: function(c){c(TEST_LOCATION_LIST);}};
        }
      });

      $provide.value('filtersService', {
        getProducts: function(){
          return {then: function(c){c(TEST_PRODUCTS_LIST);}};
        },
        getBestRateProduct: function() {
          return {then: function(c){c({id: 1});}};
        }
      });

      $provide.value('modalService', {});

      $provide.value('$stateParams', {});

      $provide.value('Settings', {
        UI: {
          bookingWidget: settings || TEST_SETTINGS
        }
      });

      $controllerProvider.register('GuestsCtrl', function($scope){
        $scope.guestsOptions = {adults: [{value: 1}], children: []};
      });
    });

    inject(function($compile, $rootScope, $templateCache,
      queryService, propertyService, locationService, filtersService, bookingService, validationService) {

      env.clock = sinon.useFakeTimers(0 , 'Date');
      env.clock.tick(window.moment('2015-01-25T10:53:35+0000').valueOf());

      env.$compile = $compile;
      env.$rootScope = $rootScope.$new();
      env.propertyService = propertyService;
      env.locationService = locationService;
      env.filtersService = filtersService;
      env.bookingService = bookingService;
      env.queryService = queryService;
      env.validationService = validationService;

      env.$templateCache = $templateCache;
      env.$templateCache.put(TEMPLATE_URL, '');

      // Spy's
      env.templateCacheGet = sinon.spy(env.$templateCache, 'get');
      env.propertyServiceGetAll = sinon.spy(env.propertyService, 'getAll');
      env.locationServiceGetRegions = sinon.spy(env.locationService, 'getRegions');
      env.propertyServiceGetAvailability = sinon.spy(env.propertyService, 'getAvailability');
      env.filtersServiceGetProducts = sinon.spy(env.filtersService, 'getProducts');
      env.validationServiceIsValueValid = sinon.spy(env.validationService, 'isValueValid');
      env.queryServiceRemoveParam = sinon.spy(env.queryService, 'removeParam');
      env.bookingServiceGetParams = sinon.spy(env.bookingService, 'getParams');

      // Final component compile
      env.elem = env.$compile(TEMPLATE)(env.$rootScope);
      env.$rootScope.$digest();
      env.scope = env.elem.isolateScope();
    });
  }

  function tearDown(){
    env.templateCacheGet.restore();
    env.propertyServiceGetAll.restore();
    env.locationServiceGetRegions.restore();
    env.propertyServiceGetAvailability.restore();
    env.filtersServiceGetProducts.restore();
    env.validationServiceIsValueValid.restore();
    env.queryServiceRemoveParam.restore();
    env.bookingServiceGetParams.restore();
    env.clock.restore();
  }

  describe('without all properties option', function(){
    beforeEach(function() {
      setUp();
    });

    afterEach(function() {
      tearDown();
    });

    describe('when component is initialized', function() {
      it('should download widget template from template cache', function() {
        expect(env.templateCacheGet.calledOnce).equal(true);
        expect(env.templateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
      });

      it('should read widget settings from the configuration', function() {
        expect(env.scope.settings).equal(TEST_SETTINGS);
        expect(env.scope.selected).to.be.an('object');
      });

      it('should download a property and location list from the server', function() {
        expect(env.propertyServiceGetAll.calledOnce).equal(true);
        expect(env.locationServiceGetRegions.calledOnce).equal(true);
        expect(env.filtersServiceGetProducts.calledOnce).equal(true);
      });

      //it('should do initial param validation', function() {
      //  expect(env.validationServiceIsValueValid.callCount).equal(9);
      //  expect(env.queryServiceRemoveParam.callCount).equal(6);
      //});

      it('should read booking parameters from the URL', function() {
        expect(env.bookingServiceGetParams.callCount).equal(4);
      });
    });

    describe('property availability check', function() {
      //it('should request availability data from the server when property is specifyed', function() {
      //  expect(env.propertyServiceGetAvailability).calledOnce;
      //});

      //it('should request availability with dates modifyed by rules provided via settings and dates must be >= todays date', function() {
      //  expect(env.propertyServiceGetAvailability).calledWith(TEST_PROPERTY_LIST[0].code,
      //    {from: '2015-01-25', to: '2015-04-03', adults: 1, children: 0, productGroupId: 1});
      //});

      //it('should create availability settings for datepicker', function() {
      //  var availability = env.scope.availability;
       // expect(availability).to.be.an('object');
      //  expect(Object.keys(availability).length).equal(1);
       // expect(availability['2015-02-03']).equal('date-not-available');
      //});
    });

    describe('isSearchable', function() {
      it('should be defined on scope as a function', function() {
        expect(env.scope.isSearchable).to.be.an('function');
      });

      it('should return false when required fields doesnt contain data', function() {
        //TODO:FIX
        //expect(env.scope.isSearchable()).equal(false);
      });
    });

    describe('onSearch', function() {
      it('should be defined on scope as a function', function() {
        expect(env.scope.onSearch).to.be.an('function');
      });
    });

  });

  describe('with all properties option', function(){
    beforeEach(function() {
      var settings = TEST_SETTINGS;
      settings.includeAllPropertyOption = true;
      setUp(settings);
    });

    afterEach(function() {
      tearDown();
    });

    /*
    it('should add all properties option to the top of the property list', function() {
      expect(env.scope.propertyRegionList.length).equal(4);

      expect(env.scope.propertyRegionList[0].code).equal(undefined);
      expect(env.scope.propertyRegionList[0].name).to.be.an('string');
      expect(env.scope.propertyRegionList[0].type).equal('all');
      expect(env.scope.propertyRegionList[1].code).equal('TESTREG');
      expect(env.scope.propertyRegionList[1].type).equal('region');
      expect(env.scope.propertyRegionList[2].code).equal('TESTLOC');
      expect(env.scope.propertyRegionList[2].type).equal('location');
      expect(env.scope.propertyRegionList[3].code).equal('TESTPROP');
      expect(env.scope.propertyRegionList[3].type).equal('property');
    });
    */
  });
});
