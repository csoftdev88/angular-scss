'use strict';

describe('userobject', function() {
  var _userObject;

  var TEST_USER = {id: 123};

  beforeEach(function(){
    module('mobiusApp', function($provide) {
      // Mocking $stateParams service
      $provide.value('userObject', TEST_USER);
    });

    inject(function(userObject) {
      _userObject = userObject;
    });
  });

  describe('constant', function(){
    it('should store user data correctly', function() {
      expect(_userObject.id).equal(TEST_USER.id);
    });
  });
});
