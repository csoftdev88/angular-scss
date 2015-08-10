'use strict';

describe('mobius.controllers.common.autofillSync', function() {
  describe('AuthCtrl', function() {

    var _scope;

    beforeEach(function() {
      module('mobius.controllers.common.autofillSync', function($provide){
        $provide.value('Settings', {
          UI: {
            autoprefill: {
              delay: 500
            }
          }
        });
      });
    });

    beforeEach(inject(function($controller, $window, $rootScope) {
      _scope = $rootScope.$new();
      $controller('AutofillSyncCtrl', { $scope: _scope });
    }));

    describe('autofillSync', function() {
      it('should defined as a function on scope', function(){
        expect(_scope.autofillSync).to.be.a('function');
      });
    });
  });
});