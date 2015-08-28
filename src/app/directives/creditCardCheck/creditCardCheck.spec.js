'use strict';

describe('creditCardCheck', function() {
  var _$compile, _$rootScope, _element, _form;

  beforeEach(function() {

    module('mobiusApp.services.creditCardType', function($provide) {
      $provide.value('Settings', {
        UI: {
          'booking': {
            cardTypes: {
              'visa': {
                regex: /^4[0-9]{12}(?:[0-9]{3})?$/,
                icon: 'visa',
                code: 'VI'
              }
            }
          }
        }
      });
    });

    module('mobiusApp.directives.creditCardCheck');
  });

  beforeEach(inject(function($compile, $rootScope) {
    _$compile = $compile;
    _$rootScope = $rootScope;
    _$rootScope.cardNumber = '';

    _element = _$compile('<form name="form"><input credit-card-check name="cardNumber" ng-model="cardNumber"/></form>')(_$rootScope);
    $rootScope.$digest();
    _form = _$rootScope.form;
  }));

  describe('when initialized', function() {
    it('should not change the content of the element', function(){
      expect(_element.html()).equal('<input credit-card-check="" name="cardNumber" ng-model="cardNumber" class="ng-pristine ng-untouched ng-invalid ng-invalid-credit-card-check">');
    });
  });

  describe('formating', function() {
    it('should properly format credit card model value', function(){
      _form.cardNumber.$setViewValue('4222 22222 2222');
      expect(_$rootScope.cardNumber).equal('4222222222222');
    });
  });

  describe('validation', function(){
    it('should set validity of form input to true when CC number is valid', function(){
      _form.cardNumber.$setViewValue('4222222222222');
      expect(_form.cardNumber.$valid).equal(true);
    });
  });
});
