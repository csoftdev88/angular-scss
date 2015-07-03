'use strict';

describe('mobius.controllers.common.auth', function() {
  describe('AuthCtrl', function() {

    var _scope;

    beforeEach(function() {
      module('mobius.controllers.common.auth');
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();

      $controller('AuthCtrl', { $scope: _scope });
    }));

    describe('initialization', function() {
    });
  });
});