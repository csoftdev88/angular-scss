'use strict';

describe('dateTimeFilter', function() {
  var _dateTimeFilter;

  var TEST_DATE = '2014-12-12T20:30:00+0000';
  var TEST_RESULT_1 = '12 Dec 14';
  var TEST_RESULT_2 = 'Dec 12th 14';
  var OUTPUT_FORMAT = 'MMM Do YY';

  var INTPUT_FORMAT = 'DD-MM-YYYY';
  var TEST_DATE_2 = '02-12-2014';
  var TEST_RESULT_3 = 'Dec 2nd 14';

  beforeEach(function() {
    module('mobiusApp.filters.dateTime', function() {});
  });

  beforeEach(inject(function(dateTimeFilter) {
    _dateTimeFilter = dateTimeFilter;
  }));

  describe('output formating', function() {
    it('should convert the date using default settings', function() {
      expect(_dateTimeFilter(TEST_DATE)).equal(TEST_RESULT_1);
    });

    it('should convert the date to a custom format', function() {
      expect(_dateTimeFilter(TEST_DATE, OUTPUT_FORMAT)).equal(TEST_RESULT_2);
    });
  });

  describe('input format settings', function() {
    it('should convert the date according to the input format settings', function() {
      expect(_dateTimeFilter(TEST_DATE_2, OUTPUT_FORMAT, INTPUT_FORMAT)).equal(TEST_RESULT_3);
    });
  });
});
