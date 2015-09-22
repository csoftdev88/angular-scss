'use strict';

describe('stringLocaleReplace', function() {
  var _stringLocaleReplaceFilter;
  var TEST_SETTINGS = {
    'chainPrefix': 'Sutton Place Hotel'
  };
  var TEST_PARAM = {
    'nameShort': 'Revelstoke'
  };
  var TEST_STRING = 'The {chainPrefix} {nameShort} Location';

  beforeEach(function() {
    module('mobiusApp.filters.stringLocaleReplace', function ($provide) {
      // Mocking the services
      $provide.value('Settings', {
        UI: {
          hotelDetails: TEST_SETTINGS
        }
      });
    });
  });

  beforeEach(inject(function($filter) {
    _stringLocaleReplaceFilter = $filter('stringLocaleReplace');
  }));

  it('should return an empty string when input is not defined', function() {
    expect(_stringLocaleReplaceFilter(null)).equal('');
    expect(_stringLocaleReplaceFilter()).equal('');
  });

  it('should return properly replace the string with the Setting var filter param', function() {
    expect(_stringLocaleReplaceFilter(TEST_STRING, TEST_PARAM)).equal('The Sutton Place Hotel Revelstoke Location');
  });
});
