'use strict';

describe('preferenceService', function() {
  var _preferenceService;
  var TEST_KEY = 'key-key';
  var TEST_VALUE = 'test123';

  beforeEach(function() {
    module('mobiusApp.services.preference');
  });

  beforeEach(inject(function(preferenceService) {
    _preferenceService = preferenceService;
  }));

  describe('set', function() {
    it('should set a value', function() {
      expect(_preferenceService.get(TEST_KEY)).equal(undefined);
      _preferenceService.set(TEST_KEY, TEST_VALUE);
      expect(_preferenceService.get(TEST_KEY)).equal(TEST_VALUE);
    });
  });

  describe('get', function() {
    it('should get a value', function() {
      _preferenceService.set(TEST_KEY, TEST_VALUE);
      expect(_preferenceService.get(TEST_KEY)).equal(TEST_VALUE);
    });
  });

  describe('setDefault', function() {
    it('should set default value when no value is set yet', function() {
      expect(_preferenceService.get(TEST_KEY)).equal(undefined);
      _preferenceService.setDefault(TEST_KEY, TEST_VALUE);
      expect(_preferenceService.get(TEST_KEY)).equal(TEST_VALUE);
    });

    it('should not change the value when already defined', function() {
      _preferenceService.set(TEST_KEY, TEST_VALUE);
      _preferenceService.setDefault(TEST_KEY, 123);
      expect(_preferenceService.get(TEST_KEY)).equal(TEST_VALUE);
    });
  });
});
