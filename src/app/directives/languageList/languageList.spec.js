'use strict';

describe('languageList', function() {
  var _$compile, _$rootScope, _element, _scope,
    _spyTemplateCacheGet, _contentService, _stateService, _$window;

  var TEMPLATE = '<language-list></language-list>';
  var TEMPLATE_URL = 'directives/languageList/languageList.html';
  var TEMPLATE_CONTENT = '<p>language-list</p>';

  var LANG_DATA = [{'code':'en-us','name':'US English'}];

  beforeEach(function() {
    module('underscore');

    module('mobiusApp.directives.language', function($provide){
      $provide.value('Settings', {
        UI: {
          'languages': {
            'en-us': {
              'shortName': 'EN',
              'name': 'English (US)',
              'decimalSeparator': '.',
              'groupSeparator': ',',
              'groupSize': 3,
              'neg': '-'
            },
            'en-ca': {
              'shortName': 'EN',
              'name': 'English (CAN)',
              'decimalSeparator': '.',
              'groupSeparator': ',',
              'groupSize': 3,
              'neg': '-'
            },
            'cs-cz': {
              'shortName': 'CZ',
              'name': 'Čeština',
              'decimalSeparator': ',',
              'groupSeparator': '\u00a0',
              'groupSize': 3,
              'neg': '-'
            },
            'de': {
              'shortName': 'DE',
              'name': 'German',
              'decimalSeparator': ',',
              'groupSeparator': '\u00a0',
              'groupSize': 3,
              'neg': '-'
            }
          }
        }
      });

      $provide.value('contentService', {
        getLanguages: sinon.stub()
      });

      $provide.value('stateService', {
        getAppLanguageCode: sinon.stub().returns('en-us')
      });

      $provide.value('$location', {
        path: sinon.stub().returns('/'),
        search: sinon.stub().returns('currency=CAD'),
        hash: sinon.stub().returns('')
      });

      $provide.value('user', {
        storeUserLanguage: function(){}
      });

    });
  });

  beforeEach(inject(function($compile, $rootScope, $window, $templateCache, $q, contentService, stateService) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    $templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    _spyTemplateCacheGet = sinon.spy($templateCache, 'get');

    _contentService = contentService;
    _contentService.getLanguages.returns($q.when(LANG_DATA));

    _stateService = stateService;

    _$window = $window;

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

    it('should get current language from state service and define it on scope', function(){
      expect(_scope.currentLanguage).equal('en-us');
      expect(_stateService.getAppLanguageCode.calledOnce).equal(true);
    });

    it('should download currencies from the server', function(){
      expect(_contentService.getLanguages.calledOnce).equal(true);
    });

    it('should define all languages on scope', function(){
      expect(_scope.languages.length).equal(1);
      expect(_scope.languages[0].name).equal('English (US)');
    });
  });

  describe('getShortName', function() {
    it('should return short name of the language', function(){
      expect(_scope.getShortName('en-us')).equal('EN');
    });
  });

  describe('getFullName', function() {
    it('should return full name of the language', function(){
      expect(_scope.getFullName('en-us')).equal('English (US)');
    });
  });

  describe('changeLanguage', function() {
    beforeEach(function(){
      sinon.stub(_$window.location, 'replace').returns(function(){});
    });

    afterEach(function(){
      _$window.location.replace.restore();
    });

    it('should reload the application with a new language query param /en-us/?currency=CAD', function(){
      _scope.changeLanguage({code: 'cs-cz'});
      expect(_$window.location.replace.calledOnce).equal(true);
      expect(_$window.location.replace.calledWith('/cs-cz/?0=c 1=u 2=r 3=r 4=e 5=n 6=c 7=y 8=%3D 9=C 10=A 11=D')).equal(true);
    });
  });
});
