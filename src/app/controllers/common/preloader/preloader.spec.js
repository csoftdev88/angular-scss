'use strict';

describe('mobius.controllers.common.preloader', function() {
  describe('PreloaderCtrl', function() {

    var _scope;

    beforeEach(function() {
      module('mobius.controllers.common.preloader');
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();

      $controller('PreloaderCtrl', { $scope: _scope });
    }));

    afterEach(function() {
    });

    describe('show', function() {
      it('should have show function defined under preloader object', function() {
        expect(_scope.preloader.show).to.be.a('function');
      });

      it('should set preloader visibility to true', function() {
        expect(_scope.preloader.visible).equal(undefined);
        _scope.preloader.show();
        expect(_scope.preloader.visible).equal(true);
      });
    });

    describe('hide', function() {
      it('should have hide function defined under preloader object', function() {
        expect(_scope.preloader.show).to.be.a('function');
      });

      it('should set preloader visibility to false', function() {
        expect(_scope.preloader.visible).equal(undefined);
        _scope.preloader.hide();
        expect(_scope.preloader.visible).equal(false);
      });
    });

    describe('listeners', function() {
      it('should listen for EVENT_PRELOADER event', function() {
        // Show
        expect(_scope.preloader.visible).equal(undefined);
        _scope.$broadcast('EVENT_PRELOADER', {visibility: true});
        expect(_scope.preloader.visible).equal(true);

        // Hide
        _scope.$broadcast('EVENT_PRELOADER', {visibility: false});
        expect(_scope.preloader.visible).equal(false);
      });
    });
  });
});