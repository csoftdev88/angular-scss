'use strict';

describe('mobius.controllers.common.sanitize', function() {
  describe('SanitizeCtrl', function() {
    var _scope, _spySceTrustAsHtml;

    var TEST_SANITIZED_HTML = '<sanitized/>';

    beforeEach(function() {
      module('mobius.controllers.common.sanitize', function($provide) {
        $provide.value('$sce', {
            trustAsHtml: function(){
              return TEST_SANITIZED_HTML;
            }
          });
      });
    });

    beforeEach(inject(function($controller, $rootScope, $sce) {
      _scope = $rootScope.$new();

      // Spy
      _spySceTrustAsHtml = sinon.spy($sce, 'trustAsHtml');

      $controller('SanitizeCtrl', { $scope: _scope });
    }));

    afterEach(function() {
      _spySceTrustAsHtml.restore();
    });

    describe('methods', function() {
      it('should define sanitize function on scope', function() {
        expect(_scope.sanitize).to.be.a('function');
      });

      it('should invoke trustAsHtml function on $sce service', function() {
        _scope.sanitize('test');

        expect(_spySceTrustAsHtml.calledOnce).equal(true);
        expect(_spySceTrustAsHtml.calledWith('test')).equal(true);
      });

      it('should return sinitized HTML content', function() {
        expect(_scope.sanitize('test')).equal(TEST_SANITIZED_HTML);
      });
    });
  });
});