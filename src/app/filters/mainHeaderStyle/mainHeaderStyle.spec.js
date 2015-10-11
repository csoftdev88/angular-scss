'use strict';

describe('mainHeaderStyle', function() {
  var _mainHeaderStyleFilter;
  var TEST_SETTINGS = {
    'disableMainHeaderStyle': false
  };


  beforeEach(function() {
    module('mobiusApp.filters.mainHeaderStyle', function ($provide) {
      // Mocking the services
      $provide.value('Settings', {
        UI: {
          generics: TEST_SETTINGS
        }
      });
    });
  });

  beforeEach(inject(function($filter) {
    _mainHeaderStyleFilter = $filter('mainHeaderStyle');
  }));

  it('should return an empty string when input is not defined', function() {
    expect(_mainHeaderStyleFilter(null)).equal('');
    expect(_mainHeaderStyleFilter()).equal('');
  });

  it('should return properly formatted title and wrap words into a strong tag based on the wrap var', function() {
    expect(_mainHeaderStyleFilter('Title Strong', 3)).equal('Title Strong');
    expect(_mainHeaderStyleFilter('Title Strong Stronger', 2)).equal('Title <strong>Strong Stronger</strong>');
  });

  it('should return properly formatted title and wrap last word into a strong tag when wrap is not defined', function() {
    expect(_mainHeaderStyleFilter('Title')).equal('Title');
    expect(_mainHeaderStyleFilter('Title Strong')).equal('Title <strong>Strong</strong>');
    expect(_mainHeaderStyleFilter('Title Strong Stronger')).equal('Title Strong <strong>Stronger</strong>');
  });
});
