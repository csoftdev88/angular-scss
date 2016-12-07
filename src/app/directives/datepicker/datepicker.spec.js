'use strict';

describe('datepicker', function() {
  var _$rootScope, _$compile, _elem;
  var TEMPLATE = '<div range-datepicker ng-model="testModel"></div>';

  beforeEach(module('mobiusApp.directives.datepicker'));

  beforeEach(function() {
    module('mobiusApp.directives.datepicker', function($provide) {
      $provide.value('ngModelCtrl', {});
      $provide.value('$filter', {});
      $provide.value('$stateParams', {});
      $provide.value('propertyService', {});
      $provide.value('_', {});
      $provide.value('stateService', {
        getAppLanguageCode: function(){},
        isMobile: function(){}
      });
      $provide.value('Settings', {
        'UI': {
          'bookingWidget': {
            'datePickerNumberOfMonths': 1,
            'datePickerHasCounter': true,
            'datePickerCounterIncludeDates': false,
            'searchOffset': {
              'enable': true,
              'days': 999
            }
          }
        }
      });
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
