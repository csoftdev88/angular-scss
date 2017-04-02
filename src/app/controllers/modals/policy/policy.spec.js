'use strict';

describe('mobius.controllers.modals.policy', function() {
  describe('PolicyCtrl', function() {

    var _scope;

    beforeEach(function() {
      module('mobius.controllers.modals.data');
      module('mobius.controllers.common.sanitize');

      module('mobius.controllers.modals.policy', function($provide){
        $provide.value('$modalInstance', {});

        $provide.value('data', {});

        $provide.value('stateService', {});

        $provide.value('Settings', {
          UI: {
            'policies': {
              'cancellation': {
                'title':'Cancellation',
                'code':'24HR'
              }
            },
            'currencies': {
              'default': 'CAD'
            }
          }
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();

      $controller('PolicyCtrl', { $scope: _scope });
    }));

    describe('inheritance', function() {
      it('should inherit methods from ModalDataCtrl', function() {
        expect(_scope.cancel).to.be.a('function');
        expect(_scope.ok).to.be.a('function');
      });

      it('should inherit methods from SanitizeCtrl', function() {
        expect(_scope.sanitize).to.be.a('function');
      });
    });

    describe('getPolicyTitle', function() {
      it('should be defined as a function on scope', function() {
        expect(_scope.getPolicyTitle).to.be.a('function');
      });

      it('should return title according to the settings', function() {
        expect(_scope.getPolicyTitle('cancellation')).equal('Cancellation');
      });

      it('should return policy code in case when title is not found in settings', function() {
        expect(_scope.getPolicyTitle('someother')).equal('someother');
      });
    });
  });
});
