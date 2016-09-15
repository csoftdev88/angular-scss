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

  it('should wrap the string in a strong tag if there is only 1 word', function() {
    expect(_mainHeaderStyleFilter('Title')).equal('<strong>Title</strong>');
  });

  it('should wrap the 2nd word of the string in a strong tag if there are 2 words', function() {
    expect(_mainHeaderStyleFilter('Page Title')).equal('Page <strong>Title</strong>');
  });

  it('should leave the first 2 words as is and wrap the remaining words in a strong tag if more than 2 words', function() {
    expect(_mainHeaderStyleFilter('This is a Page Title')).equal('This is <strong>a Page Title</strong>');
  });
});
