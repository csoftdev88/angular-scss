'use strict';

describe('mobiusApp.filters.mainHeaderStyle', function() {
  var _filter;

  beforeEach(function() {
    module('mobiusApp.filters.mainHeaderStyle');
  });

  beforeEach(inject(function($filter) {
    _filter = $filter('mainHeaderStyle');
  }));

  it('should return an empty string when input is not defined', function() {
    expect(_filter()).equal('');
    expect(_filter(null)).equal('');
  });

  it('should wrap the string with the strong tag except for the first word', function() {
    expect(_filter('test this string')).equal('test <strong>this string</strong>');
  });

});
