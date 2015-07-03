'use strict';

describe('mobius.controllers.common.preference', function() {
  describe('PreferenceCtrl', function() {

    var _scope;

    beforeEach(function() {
      module('mobius.controllers.common.preference');
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();

      $controller('PreferenceCtrl', { $scope: _scope });
    }));

    describe('preference', function() {
      it('should define preference object on scope', function() {
        expect(_scope.preference).to.be.a('object');
      });

      it('should preference methods correctly', function() {
        expect(_scope.preference.set).to.be.a('function');
        expect(_scope.preference.get).to.be.a('function');
        expect(_scope.preference.setDefault).to.be.a('function');
      });
    });
  });
});