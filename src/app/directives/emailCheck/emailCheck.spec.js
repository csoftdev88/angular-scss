'use strict';

describe('emailCheck', function() {
  var _$compile, _$rootScope, _element, _form;

  beforeEach(function() {
    module('mobiusApp.directives.emailCheck');
  });

  beforeEach(inject(function($compile, $rootScope) {
    _$compile = $compile;
    _$rootScope = $rootScope;
    _$rootScope.email = '';

    _element = _$compile('<form name="form"><input emailCheck name="email" ng-model="email"/></form>')(_$rootScope);
    $rootScope.$digest();
    _form = _$rootScope.form;
  }));

  describe('when initialized', function() {
    it('should not change the content of the element', function(){
      expect(_element.html()).equal('<input emailcheck="" name="email" ng-model="email" class="ng-pristine ng-untouched ng-valid">');
    });
  });

  describe('validation', function(){
    it('should set validity of form input to true email address is correct', function(){
      _form.email.$setViewValue('test@test.com');
      expect(_form.email.$valid).equal(true);
    });
  });
});
