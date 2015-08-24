'use strict';

describe('mobiusApp.services.modal', function() {
  var _modalService, _spyModalOpen, _spyModalStackDismissAll;

  beforeEach(function() {
    module('underscore');
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

      $provide.value('preloaderFactory', {});

      $provide.value('Settings', {
        UI: {
          myAccount: {
            displaySettings: {
              profile: true
            }
          }
        }
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

    it('should open the dialog and specify dialog position based on the settings', function() {
      _modalService.openLoyaltyDialog();
      expect(_spyModalOpen.args[0][0].windowClass).equal('dialog-loyalty position-2');
    });
  });

  describe('openGallery', function() {
    it('should be defined as a function', function() {
      expect(_modalService.openGallery).to.be.an('function');
    });

    it('should open lightbox dialog', function() {
      _modalService.openGallery();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalDataCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/lightbox.html'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'lightbox'))).equal(true);
    });

    it('should open lightbox dialog with with array of images according to heroSlider format', function() {
      _modalService.openGallery(['http://test.com']);
      var spyParams = _spyModalOpen.args[0][0];

      var dynamicDataDependency = spyParams.resolve.data();
      expect(dynamicDataDependency.length).equal(1);
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

  describe('openRoomDetailsDialog', function() {
    it('should be defined as a function', function() {
      expect(_modalService.openRoomDetailsDialog).to.be.an('function');
    });

    it('should open room details dialog', function() {
      _modalService.openRoomDetailsDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalDataCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'details'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/roomDetails.html'))).equal(true);
    });
  });

  describe('openLoginDialog', function() {
    it('should be defined as a function', function() {
      expect(_modalService.openLoginDialog).to.be.an('function');
    });

    it('should open login prompt dialog', function() {
      _modalService.openLoginDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalDataCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'login-prompt'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/loginPrompt.html'))).equal(true);
    });
  });


  describe('openOtherRoomsDialog', function() {
    it('should be defined as a function', function() {
      expect(_modalService.openOtherRoomsDialog).to.be.an('function');
    });

    it('should open other rooms dialog', function() {
      _modalService.openOtherRoomsDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalDataCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'other-rooms details'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/reservation/otherRooms.html'))).equal(true);
    });
  });

  describe('openTiersListDialog', function() {
    it('should be defined as a function', function() {
      expect(_modalService.openTiersListDialog).to.be.an('function');
    });

    it('should open other rooms dialog', function() {
      _modalService.openTiersListDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'details tiers-list'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/loyalties/tiersList.html'))).equal(true);
    });
  });

  describe('openModifyingReservationDialogue', function() {
    it('should open modifying reservation dialogue', function() {
      _modalService.openModifyingReservationDialogue();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalDataCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'details reservation-modification'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/reservation/modifyReservation.html'))).equal(true);
    });
  });

  describe('openCancelReservationDialog', function() {
    it('should open cancel reservation dialog', function() {
      _modalService.openCancelReservationDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalDataCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'details confirmation-dialog'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/reservation/cancelReservationDialog.html'))).equal(true);
    });
  });

  describe('openReservationModifyingDisabledDialogue', function() {
    it('should open reservation modifying disable dialogue', function() {
      _modalService.openReservationModifyingDisabledDialogue();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'details reservation-modification'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/reservation/cannotModify.html'))).equal(true);
    });
  });

  describe('openReservationCancelingDisabledDialogue', function() {
    it('should open reservation canceling disable dialogue', function() {
      _modalService.openReservationCancelingDisabledDialogue();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'details reservation-modification'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/reservation/cannotCancel.html'))).equal(true);
    });
  });

  describe('openReservationModificationCanceledDialogue', function() {
    it('should open reservation modification canceled dialogue', function() {
      _modalService.openReservationModificationCanceledDialogue();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalDataCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'details reservation-modification'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/reservation/modificationCanceled.html'))).equal(true);
    });
  });

  describe('openReservationLookupFailedDialog', function() {
    it('should open reservation lookup failed dialog', function() {
      _modalService.openReservationLookupFailedDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'narrow'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/reservation/reservationLookupFailed.html'))).equal(true);
    });
  });

  describe('openReservationLookupLoginDialog', function() {
    it('should open reservation lookup login dialog', function() {
      _modalService.openReservationLookupLoginDialog();
      expect(_spyModalOpen.calledOnce).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'controller', 'ModalCtrl'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'windowClass', 'narrow login'))).equal(true);

      expect(_spyModalOpen.calledWith(sinon.match.has(
        'templateUrl', 'layouts/modals/reservation/reservationLookupLogin.html'))).equal(true);
    });
  });

});
