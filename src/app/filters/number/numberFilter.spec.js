'use strict';

describe('i18nNumber', function() {
  var env;

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('underscore');
    module('mobiusApp.filters.number', function($provide) {
      var Settings = {
        'UI': {
          'languages': {
            'en-us': {
              'decimalSeparator': '.',
              'groupSeparator': ',',
              'groupSize': 3,
              'neg': '-'
            }
          }
        }
      };

      var stateService = function() {
        return {
          getAppLanguageCode: function() {
            return 'en-us';
          }
        };
      };

      $provide.value('Settings', Settings);
      $provide.service('stateService', stateService);
    });
  });

  beforeEach(inject(function($filter) {
    env.$filter = $filter;
  }));

  it('should return input on string input', function() {
    expect(env.$filter('i18nNumber')('ABC')).equal('ABC');
  });
  it('should return input on undefined input', function() {
    expect(env.$filter('i18nNumber')(undefined)).equal(undefined);
  });

  it('should return input on null input', function() {
    expect(env.$filter('i18nNumber')(null)).equal(null);
  });

  it('should return formatted number on string number input', function() {
    expect(env.$filter('i18nNumber')('123456')).equal('123,456');
  });


  it('should return formatted number on positive numeric input', function() {
    expect(env.$filter('i18nNumber')(123456.987, 2)).equal('123,456.99');
  });

  it('should return formatted number on negative numeric input', function() {
    expect(env.$filter('i18nNumber')(-123456.987, 4)).equal('-123,456.9870');
  });
});
