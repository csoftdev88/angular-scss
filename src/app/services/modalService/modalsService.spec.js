'use strict';

describe('mobiusApp.services.modal', function() {
  var _modalService, _spyModalOpen;

  beforeEach(function() {
    module('mobiusApp.services.modal', function($provide) {
      // Mocking $stateParams service

      $provide.value('$modal', {
        open: function(){
          return {
            result: {
              then: function(){}
            }
          };
        }
      });

      $provide.value('queryService', {
        setValue: function(){}
      });
    });
  });

  beforeEach(inject(function($rootScope, $modal, modalService) {
    _modalService = modalService;
    _spyModalOpen = sinon.spy($modal, 'open');
  }));

  afterEach(function() {
    _spyModalOpen.restore();
  });

  describe('openBadgesDialog', function() {
    it('should be defined as a function', function() {
      expect(_modalService.openBadgesDialog).to.be.an('function');
    });

    it('should open badges dialog', function() {
      _modalService.openBadgesDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'LoyaltiesCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/loyalties/badges.html'))).equal(true);
    });
  });

  describe('openLoyaltiesDialog', function() {
    it('should be defined as a function', function() {
      expect(_modalService.openLoyaltiesDialog).to.be.an('function');
    });

    it('should open loyalties dialog', function() {
      _modalService.openLoyaltiesDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'LoyaltiesCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/loyalties/loyalties.html'))).equal(true);
    });
  });
});
