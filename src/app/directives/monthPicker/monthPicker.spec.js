'use strict';

describe('monthPicker', function() {
  var _$rootScope, _$compile, _elem;
  var TEMPLATE = '<input month-picker ng-model="testModel">';

  beforeEach(module('mobiusApp.directives.monthPicker'));

  beforeEach(function() {
    module('mobiusApp.directives.monthPicker', function($provide) {
      $provide.value('ngModelCtrl', {});
    });
  });

  beforeEach(inject(function($compile, $rootScope) {
    _$compile = $compile;
    _$rootScope = $rootScope;
  }));

  describe('when directive is initialized', function() {
    beforeEach(function() {
      _elem = _$compile(TEMPLATE)(_$rootScope);
    });

    it('should not insert any template into a parent container)', function() {
      expect(_elem.html()).equal('');
    });
  });
});
