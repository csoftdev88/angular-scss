'use strict';

describe('mobiusApp.filters.pluralization', function() {
  var _filter,
  TEST_RULES = {
    '0': 'No days',
    '1': '{} day',
    'plural': '{} days'
  };

  beforeEach(function() {
    module('mobiusApp.filters.pluralization');
  });

  beforeEach(inject(function($filter) {
    _filter = $filter('pluralization');
  }));

  it('should return an empty string when no number or rules are provided', function() {
    expect(_filter()).equal('');
    expect(_filter(1)).equal('');
  });

  it('should return correctly pluralized text based on the rules', function() {
    expect(_filter(0, TEST_RULES)).equal('No days');
    expect(_filter(1, TEST_RULES)).equal('1 day');
    expect(_filter(5, TEST_RULES)).equal('5 days');
  });
});
