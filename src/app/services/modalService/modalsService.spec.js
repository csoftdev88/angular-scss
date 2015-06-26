'use strict';

describe('mobiusApp.services.modal', function() {
  var _modalService, _spyModalOpen, _spyModalStackDismissAll;

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

      $provide.value('$modalStack', {
        dismissAll: function(){}
      });

      $provide.value('queryService', {
        setValue: function(){}
      });
    });
  });

  beforeEach(inject(function($rootScope, $modal, $modalStack, modalService) {
    _modalService = modalService;
    _spyModalOpen = sinon.spy($modal, 'open');
    _spyModalStackDismissAll = sinon.spy($modalStack, 'dismissAll');
  }));

  afterEach(function() {
    _spyModalOpen.restore();
    _spyModalStackDismissAll.restore();
  });

  describe('openBadgesDialog', function() {
    it('should be defined as a function', function() {
      expect(_modalService.openBadgesDialog).to.be.an('function');
    });

    it('should close all open modal instances', function() {
      _modalService.openBadgesDialog();
      expect(_spyModalStackDismissAll.calledOnce).equal(true);
    });

    it('should open badges dialog', function() {
      _modalService.openBadgesDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'BadgesCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/loyalties/badges.html'))).equal(true);
    });
  });

  describe('openLoyaltyDialog', function() {
    it('should be defined as a function', function() {
      expect(_modalService.openLoyaltyDialog).to.be.an('function');
    });

    it('should close all open modal instances', function() {
      _modalService.openLoyaltyDialog();
      expect(_spyModalStackDismissAll.calledOnce).equal(true);
    });

    it('should open loyalties dialog', function() {
      _modalService.openLoyaltyDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalDataCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/loyalties/loyalty.html'))).equal(true);
    });
  });

  describe('openAssociatedRoomDetail', function() {
    it('should be defined as a function', function() {
      expect(_modalService.openAssociatedRoomDetail).to.be.an('function');
    });

    it('should open associated room details dialog', function() {
      _modalService.openAssociatedRoomDetail();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalDataCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'details'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/associatedRooms.html'))).equal(true);
    });
  });
});
