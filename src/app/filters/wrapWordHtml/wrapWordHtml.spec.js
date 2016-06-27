'use strict';

describe('mobiusApp.filters.wrapword', function() {
  var _filter;

  beforeEach(function() {
    module('underscore');
    module('mobiusApp.filters.wrapword');
  });

  beforeEach(inject(function($filter) {
    _filter = $filter('wrapWordHtml');
  }));

  it('should return an empty string when input is not defined', function() {
    expect(_filter()).equal('');
    expect(_filter(null)).equal('');
  });

  it('should wrap the string with the tag provided at the index provided', function() {
    expect(_filter('test string', 'span', 0)).equal('<span>test</span> string');
  });

});
