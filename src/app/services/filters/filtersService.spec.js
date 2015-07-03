'use strict';

describe('filtersService', function() {
  var _rootScope, _filtersService, _spyApiServiceGet,
  _spyApisServiceGetFullURL;

  var TEST_PRODUCTS = [
    {'code': 'abc', 'id': 123},
    {'code': 'abcd', 'id': 456}
  ];

  beforeEach(function() {
    module('mobiusApp.services.filters', function($provide) {
      // Mocking $stateParams service
      $provide.value('Settings', {
        defaultProductRateCode: 'abc',
        defaultProductRateId: 1
      });

      var apiService = {
        get: function(){
          return {
            then: function(c){
              c(TEST_PRODUCTS);
            }
          };
        },
        getFullURL: function(p){
          return p;
        }
      };

      $provide.value('apiService', apiService);
    });
  });

  beforeEach(inject(function($rootScope, apiService, filtersService) {
    _rootScope = $rootScope;
    _filtersService = filtersService;
    _spyApiServiceGet = sinon.spy(apiService, 'get');
    _spyApisServiceGetFullURL = sinon.spy(apiService, 'getFullURL');
  }));

  afterEach(function() {
    _spyApiServiceGet.restore();
    _spyApisServiceGetFullURL.restore();
  });

  describe('getRooms', function() {
    it('should be defined as a function', function() {
      expect(_filtersService.getRooms).to.be.an('function');
    });

    it('should fire a GET request to filter/rooms API', function(){
      _filtersService.getRooms();
      expect(_spyApisServiceGetFullURL.calledOnce).equal(true);
      expect(_spyApisServiceGetFullURL.calledWith('filters.rooms')).equal(true);
      expect(_spyApiServiceGet.calledOnce).equal(true);
    });
  });

  describe('getProducts', function() {
    it('should be defined as a function', function() {
      expect(_filtersService.getRooms).to.be.an('function');
    });

    it('should fire a GET request to filter/products API', function(){
      _filtersService.getProducts();
      expect(_spyApisServiceGetFullURL.calledOnce).equal(true);
      expect(_spyApisServiceGetFullURL.calledWith('filters.products')).equal(true);
      expect(_spyApiServiceGet.calledOnce).equal(true);
    });

    it('should return cached product date', function(){
      _filtersService.getProducts();
      var products;
      _filtersService.getProducts(true).then(function(data){
        products = data;
      });

      expect(_spyApisServiceGetFullURL.calledOnce).equal(true);
      expect(_spyApiServiceGet.calledOnce).equal(true);
      _rootScope.$apply();
      expect(products).equal(TEST_PRODUCTS);
    });
  });


  describe('getBestRateProduct', function() {
    it('should be defined as a function', function() {
      expect(_filtersService.getBestRateProduct).to.be.an('function');
    });

    it('should fire a GET request to filter/products API and return BRP object',
      function() {
      var brp;
      _filtersService.getBestRateProduct().then(function(data){
        brp = data;
      });

      //expect(_spyApisServiceGetFullURL.calledOnce).equal(true);
      //expect(_spyApisServiceGetFullURL.calledWith('filters.products')).equal(true);
      //expect(_spyApiServiceGet.calledOnce).equal(true);

      _rootScope.$apply();
      //expect(brp.code).equal('abc');
      expect(brp.id).equal(1);
    });
  });
});
