'use strict';

describe('mobiusApp.filters.list', function() {
  var _filter;

  beforeEach(function() {
    module('mobiusApp.filters.list');
  });

  beforeEach(inject(function($filter) {
    _filter = $filter('numberToList');
  }));

  it('should return an empty list by default', function() {
    expect(_filter().length).equal(0);
  });

  it('should return a list with items in range from 0 to a max number', function() {
    var list = _filter(null, null, 1);
    expect(list.length).equal(2);
    expect(list[0]).equal(0);
    expect(list[1]).equal(1);
  });

  it('should return a list with items in range from min to max number', function() {
    var list = _filter(null, 5, 6);
    expect(list.length).equal(2);
    expect(list[0]).equal(5);
    expect(list[1]).equal(6);
  });
});
