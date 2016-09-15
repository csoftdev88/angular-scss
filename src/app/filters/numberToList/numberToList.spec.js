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

  it('should return a list with pluralized titles when pluralization rules are provided', function() {
    var  TEST_RULES = {
      '0': 'no items',
      '1': '{} item',
      'plural': '{} items'
    };

    var list = _filter(null, 0, 2, TEST_RULES);
    expect(list.length).equal(3);
    expect(list[0].title).equal('no items');
    expect(list[0].value).equal(0);

    expect(list[1].title).equal('1 item');
    expect(list[1].value).equal(1);

    expect(list[2].title).equal('2 items');
    expect(list[2].value).equal(2);
  });
});
