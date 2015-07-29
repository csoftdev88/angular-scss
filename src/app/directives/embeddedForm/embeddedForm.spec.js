'use strict';

describe('embeddedForm', function() {
  var _$compile, _$rootScope, _$templateCache, _spyTemplateCacheGet, _element;

  var TEMPLATE_MISSING_TYPE = '<embedded-form type="unknown"></<embedded-form>';
  var TEMPLATE_REAL_TYPE = '<embedded-form type="test"></<embedded-form>';

  var SNIPPET_TEST_URL = 'directives/embeddedForm/snippets/test.html';
  var SNIPPET_TEMPLATE = '<span>123</span>';

  beforeEach(module('mobiusApp.directives.embeddedForm'));

  beforeEach(function() {
    module('mobiusApp.directives.embeddedForm', function() {});
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    _$compile = $compile;
    _$rootScope = $rootScope;
    _$templateCache = $templateCache;
    _spyTemplateCacheGet = sinon.spy(_$templateCache, 'get');

    $templateCache.put(SNIPPET_TEST_URL, SNIPPET_TEMPLATE);
  }));

  afterEach(function(){
    _spyTemplateCacheGet.restore();
  });

  describe('when initialized', function() {
    describe('with missing snippet type', function() {
      it('should throw an error', function(){
        expect(function(){
          _$compile(TEMPLATE_MISSING_TYPE)(_$rootScope);
        })
        .to.throw(/Cannot find the corresponding template of type:unknown/);
      });
    });

    describe('with existing snippet type', function() {
      beforeEach(function(){
        _element = _$compile(TEMPLATE_REAL_TYPE)(_$rootScope);

      });

      it('should download the corresponding snippet template from template-cache', function(){
        expect(_spyTemplateCacheGet.calledOnce).equal(true);
        expect(_spyTemplateCacheGet.calledWith(SNIPPET_TEST_URL)).equal(true);
      });

      it('should append snippets template to a current element', function(){
        expect(_element.html()).equal('<!--<embedded-form--><span>123</span>');
      });
    });
  });
});
