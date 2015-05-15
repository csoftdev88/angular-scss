// FIXME: for some very strange reason it throws `Error: [ng:areq] Argument 'fn' is not a function, got Object` when using i18nNumber filter...


//'use strict';
//
//describe('i18nNumber', function() {
//  var env;
//
//  beforeEach(function() {
//    env = {};
//  });
//
//  beforeEach(function() {
//    module('mobiusApp.filters.number', function($provide) {
//      var Settings = {
//        'UI': {
//          'languages': {
//            'en-us': {
//              'decimalSeparator': '.',
//              'groupSeparator': ',',
//              'groupSize': 3,
//              'neg': '-'
//            }
//          }
//        }
//      };
//
//      var stateService = {
//        getAppLanguageCode: function() {
//          return 'en-us';
//        }
//      };
//
//      $provide.value('Settings', Settings);
//      $provide.service('stateService', stateService);
//    });
//  });
//
//  beforeEach(inject(function($filter) {
//    env.$filter = $filter;
//  }));
//
//  it('should return input if it is not number', function() {
//    expect(env.$filter('i18nNumber')('ABC')).equal('ABC');
//  });
//
//  it('should return formatted number from positive number', function() {
//    expect(env.$filter('i18nNumber')(123456.987)).equal('123.456,987');
//  });
//
//  it('should return formatted number from negative number', function() {
//    expect(env.$filter('i18nNumber')(-123456.987)).equal('-123.456,987');
//  });
//
//  it('should return formatted number from positive string', function() {
//    expect(env.$filter('i18nNumber')('123456.987')).equal('123.456,987');
//  });
//
//  it('should return formatted number from negative string', function() {
//    expect(env.$filter('i18nNumber')('-123456.987')).equal('-123.456,987');
//  });
//});
