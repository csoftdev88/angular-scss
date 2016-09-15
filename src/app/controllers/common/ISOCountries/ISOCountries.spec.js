'use strict';

describe('mobius.controllers.common.isoCountries', function() {
  describe('ISOCountriesCtrl', function() {

    var _scope;

    beforeEach(function() {
      module('mobius.controllers.common.isoCountries');
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();

      $controller('ISOCountriesCtrl', { $scope: _scope });
    }));

    describe('initialization', function() {
      it('should have a list of countries defined on scope', function(){
        expect(_scope.iso.countries).to.be.an('array');
      });
    });
  });
});
