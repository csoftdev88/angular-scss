'use strict';

describe('currencyList', function() {
  var _$compile, _$rootScope, _element, _scope,
    _spyTemplateCacheGet, _contentService, _queryService;

  var TEMPLATE = '<currency-list></currency-list>';
  var TEMPLATE_URL = 'directives/currencyList/currencyList.html';
  var TEMPLATE_CONTENT = '<p>currency-list</p>';

  var CURRENCY_DATA = [{'code':'GBP','name':'Gbpound'}];

  beforeEach(function() {
    module('underscore');

    module('mobiusApp.directives.currency', function($provide){
      $provide.value('Settings', {
        UI: {
          currencies: {
            'default': 'GBP',

            'GBP': {
              'symbol': '£',
              'format': '{{symbol}} {{amount}}'
            }
          }
        },
        'currencyParamName': 'currency'
      });

      $provide.value('contentService', {
        getCurrencies: sinon.stub()
      });

      $provide.value('user', {
        storeUserCurrency: function(){},
        getUserCurrency: function(){}
      });

      $provide.value('apiService', {
        setHeaders: function(){}
      });

      $provide.value('$state', {
        go: function(){},
        current:{
          name: 'hotel'
        }
      });

      $provide.value('$stateParams', {});

      $provide.value('queryService', {
        getValue: sinon.stub(),
        setValue: sinon.stub(),
        removeParam: sinon.stub()
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache, $q, contentService,
      queryService) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    $templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    _spyTemplateCacheGet = sinon.spy($templateCache, 'get');

    _contentService = contentService;
    _contentService.getCurrencies.returns($q.when(CURRENCY_DATA));

    _queryService = queryService;
    _queryService.getValue.returns('GBP');

    _element = _$compile(TEMPLATE)(_$rootScope.$new());
    $rootScope.$digest();
    _scope = _element.isolateScope();
  }));

  afterEach(function(){
    _spyTemplateCacheGet.restore();
  });

  describe('when initialized', function() {
    it('should download a template from template-cache', function(){
      expect(_spyTemplateCacheGet.calledOnce).equal(true);
      expect(_spyTemplateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should append template content to a current element', function(){
      expect(_element.html()).equal(TEMPLATE_CONTENT);
    });

    it('should download currencies from the server', function(){
      expect(_contentService.getCurrencies.calledOnce).equal(true);
    });

    it('should define current currency code on rootScope', function(){
      //expect(_$rootScope.currencyCode).equal('GBP');
    });

    it('should define currency on scope', function(){
      expect(_scope.currentCurrency.name).equal('Gbpound');
    });
  });

  describe('getCurrencySymbol', function() {
    it('should return currency symbol', function(){
      expect(_scope.getCurrencySymbol('GBP')).equal('£');
    });
  });

  describe('getFormattedLabel', function() {
    it('should return formatted currecny label', function(){
      expect(_scope.getFormattedLabel('GBP')).equal('GBP(£)');
    });
  });

  describe('changeCurrency', function() {
    it('should do nothing when same currency is set', function(){
      _scope.currentCurrency = 'test';
      _scope.changeCurrency('test');

      expect(_queryService.setValue.calledOnce).equal(true);
    });
    /*
    it('should change currency', function(){
      _scope.currentCurrency = 'test';
      _scope.changeCurrency({code: 'CAN', name: 'Canadian'});

      expect(_queryService.setValue.callCount).equal(2);
      expect(_$rootScope.currencyCode).equal('CAN');
    });
    */
  });
});
