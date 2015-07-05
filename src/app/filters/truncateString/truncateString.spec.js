'use strict';

describe('mobiusApp.filters.truncate', function() {
  var _filter;

  beforeEach(function() {
    module('mobiusApp.filters.truncate');
  });

  beforeEach(inject(function($filter) {
    _filter = $filter('truncateString');
  }));

  it('should return an empty string when input is not defined', function() {
    expect(_filter()).equal('');
    expect(_filter(null)).equal('');
  });

  it('should not truncate the string when maxLength is not defined', function() {
    expect(_filter('teststring')).equal('teststring');
  });

  it('should not truncate the string when string length is lower than maxLength', function() {
    expect(_filter('teststring', 20)).equal('teststring');
  });

  it('should truncate the string when length is higher than max allowed', function() {
    expect(_filter('teststring', 4)).equal('t...');
  });

  it('should truncate with a custom ending', function() {
    expect(_filter('teststring', 6, '****')).equal('te****');
  });
});
