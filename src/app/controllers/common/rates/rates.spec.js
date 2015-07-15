'use strict';

describe('mobius.controllers.common.rates', function() {
  describe('RatesCtrl', function() {

    var _scope;

    beforeEach(function() {
      module('mobius.controllers.common.rates');
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();

      $controller('RatesCtrl', { $scope: _scope });
    }));

    describe('initialization', function() {
    });
  });
});