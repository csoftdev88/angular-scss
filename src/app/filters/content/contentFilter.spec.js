'use strict';

describe('filteredContent', function() {
  var env;

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.filters.content');
  });

  beforeEach(inject(function($filter) {
    env.$filter = $filter;
  }));

  it('should return an empty list when input doesnt have any items', function() {
    expect(env.$filter('filteredContent')([]).length).equal(0);
  });

  it('should return only the items with filtered flag', function() {
    var result = env.$filter('filteredContent')([{filtered: true}, {test: 123}]);
    expect(result.length).equal(1);
    expect(result[0].filtered).equal(true);
  });
});
