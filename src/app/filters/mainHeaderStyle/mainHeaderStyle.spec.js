'use strict';

describe('mainHeaderStyle', function() {
  var _mainHeaderStyleFilter;

  beforeEach(function() {
    module('mobiusApp.filters.mainHeaderStyle');
  });

  beforeEach(inject(function($filter) {
    _mainHeaderStyleFilter = $filter('mainHeaderStyle');
  }));

  it('should return an empty string when input is not defined', function() {
    expect(_mainHeaderStyleFilter(null)).equal('');
    expect(_mainHeaderStyleFilter()).equal('');
  });

  it('should return properly formatted title and wrap last word into a strong tag', function() {
    expect(_mainHeaderStyleFilter('Title')).equal('Title');
    expect(_mainHeaderStyleFilter('Title Strong')).equal('Title <strong>Strong</strong>');
    expect(_mainHeaderStyleFilter('Title Strong Stronger')).equal('Title Strong <strong>Stronger</strong>');
  });
});
