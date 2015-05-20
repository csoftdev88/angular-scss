'use strict';

describe('i18nCurrency', function() {
  var env;

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('underscore');
    module('mobiusApp.factories.template');
    module('mobiusApp.filters.currency', function($provide, $filterProvider) {
      var Settings = {
        'UI': {
          'currencies': {
            'GBP': {
              'symbol': '£',
              'format': '{{symbol}} {{amount}}'
            }
          }
        }
      };

      var i18nNumber = function() {
        return function() {
          return '123';
        };
      };

      $provide.value('Settings', Settings);

      $filterProvider.register('i18nNumber', i18nNumber);
    });
  });

  beforeEach(inject(function($filter) {
    env.$filter = $filter;
  }));

  it('should return input if it is not number', function() {
    expect(env.$filter('i18nCurrency')('ABC')).equal('ABC');
  });

  it('should return formatted currency value with known currency from number', function() {
    expect(env.$filter('i18nCurrency')(123, 'GBP')).equal('£ 123');
  });

  it('should return formatted currency value with known currency from string', function() {
    expect(env.$filter('i18nCurrency')('123', 'GBP')).equal('£ 123');
  });

  it('should return empty string for unknown currency', function() {
    expect(env.$filter('i18nCurrency')(123, 'USD')).equal('');
  });
});
