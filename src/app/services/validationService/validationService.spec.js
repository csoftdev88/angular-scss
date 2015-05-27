'use strict';

describe('validationService', function() {
  var env;

  var TEST_VALUES = [
    {'in': '10', 'out': 10},
    {'in': 'testCode', 'out': 'testCode'},
    {'in': '-10', 'out': -10},
    {'in': '-1', 'out': -1},
    {'in': '0', 'out': 0},
    {'in': 0, 'out': 0}
  ];

  var SETTINGS_INT_SIMPLE = {
    'type': 'integer',
  };

  var SETTINGS_INT_RANGE_MIN = {
    'type': 'integer',
    'min': -1
  };

  var SETTINGS_INT_RANGE_MAX = {
    'type': 'integer',
    'max': 5
  };

  var SETTINGS_INT_RANGE_MIN_MAX = {
    'type': 'integer',
    'max': 5,
    'min': 0
  };

  var SETTINGS_STRING = {
    'type': 'string',
  };

  var SETTINGS_UNKNOWN = {
    'type': 'unknown',
  };

  var SETTINGS_OBJECT = {
    'type': 'object'
  };

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.services.validation', function() {});
  });

  beforeEach(inject(function(validationService) {
    env.validationService = validationService;
  }));

  describe('convertValue', function() {
    describe('integers', function() {
      it('should make a proper type conversion from string', function() {
        var testData = TEST_VALUES[0];
        var converted = env.validationService.convertValue(testData.in, SETTINGS_INT_SIMPLE);

        expect(converted).equal(testData.out);
      });

      it('should make a proper type conversion', function() {
        var testData = TEST_VALUES[5];
        var converted = env.validationService.convertValue(testData.in, SETTINGS_INT_SIMPLE);

        expect(converted).equal(testData.out);
      });
    });

    describe('strings', function() {
      it('should make a proper type conversion', function() {
        var testData = TEST_VALUES[1];
        var converted = env.validationService.convertValue(testData.in, SETTINGS_STRING);

        expect(converted).equal(testData.out);
      });
    });

    describe('object type', function() {
      it('should decode object correctly', function() {
        var converted = env.validationService.convertValue('%7B%22testProp%22%3A123%7D', SETTINGS_OBJECT, true);
        expect(converted.testProp).equal(123);
      });

      it('should return null when object is invalid', function() {
        var converted = env.validationService.convertValue('%7A%22testProp%22%3A123%7D', SETTINGS_OBJECT, true);
        expect(converted).equal(null);
      });
    });

    describe('unknown type', function() {
      it('should return undefined when type is unknown', function() {
        var testData = TEST_VALUES[0];
        var converted = env.validationService.convertValue(testData.in, SETTINGS_UNKNOWN);

        expect(converted).equal(undefined);
      });

      it('should return undefined when settings are undefined', function() {
        var testData = TEST_VALUES[0];
        var converted = env.validationService.convertValue(testData.in);

        expect(converted).equal(undefined);
      });
    });
  });

  describe('isValueValid', function() {
    describe('integers', function() {
      it('should do a proper validation without range settings', function() {
        var testData = TEST_VALUES[0];
        var converted = env.validationService.isValueValid(testData.out, SETTINGS_INT_SIMPLE);
        expect(converted).equal(true);
      });

      describe('when min value is specifyed', function() {
        it('should do a proper validation', function() {
          // CASE 1
          var testData = TEST_VALUES[2];
          var converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MIN);
          expect(converted).equal(false);

          // CASE 2
          testData = TEST_VALUES[3];
          converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MIN);
          expect(converted).equal(true);

          // CASE 3
          testData = TEST_VALUES[4];
          converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MIN);
          expect(converted).equal(true);
        });
      });

      describe('when max value is specifyed', function() {
        it('should do a proper validation', function() {
          // CASE 1
          var testData = TEST_VALUES[2];
          var converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MAX);
          expect(converted).equal(true);

          // CASE 2
          testData = TEST_VALUES[3];
          converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MAX);
          expect(converted).equal(true);

          // CASE 3
          testData = TEST_VALUES[4];
          converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MAX);
          expect(converted).equal(true);

          // CASE 4
          testData = TEST_VALUES[0];
          converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MAX);
          expect(converted).equal(false);
        });
      });

      describe('when min and max values are specifyed', function() {
        it('should do a proper validation', function() {
          // CASE 1
          var testData = TEST_VALUES[2];
          var converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MIN_MAX);
          expect(converted).equal(false);

          // CASE 2
          testData = TEST_VALUES[3];
          converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MIN_MAX);
          expect(converted).equal(false);

          // CASE 3
          testData = TEST_VALUES[4];
          converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MIN_MAX);
          expect(converted).equal(true);

          // CASE 4
          testData = TEST_VALUES[0];
          converted = env.validationService.isValueValid(testData.in, SETTINGS_INT_RANGE_MAX);
          expect(converted).equal(false);
        });
      });
    });
  });
});
