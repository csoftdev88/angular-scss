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

      $provide.value('preloaderFactory', {});
      $provide.value('userMessagesService', {});
      $provide.value('reservationService', {});
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
      expect(dynamicDataDependency[0].uri).equal('http://test.com');
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
