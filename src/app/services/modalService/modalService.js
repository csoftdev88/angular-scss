'use strict';
/*
* This service controls opening of all dialogs in the application
*/
angular.module('mobiusApp.services.modal', [])
.service( 'modalService',  function($modal, $q, $log, queryService) {
  var CONTROLLER_DEFAULT = 'ModalCtrl',
      CONTROLLER_DATA = 'ModalDataCtrl',
      CONTROLLER_RESERVATIONS = 'ModalReservationCtrl',
      CONTROLLER_POLICY = 'PolicyCtrl',
      CONTROLLER_BADGES = 'BadgesCtrl',
      CONTROLLER_LOAYALTY = 'LoyaltyCtrl',
      CONTROLLER_GALLERY = 'GalleryCtrl',
      CONTROLLER_ASSOCIATED_ROOM = 'AssociatedRoomCtrl',
      DIALOG_PARAM_NAME = 'dialog';

  function openDialog(dialogName, templateUrl, controller, options){
    var q = $q.defer(),
        modalOptions = { templateUrl: templateUrl, controller: controller, windowTemplateUrl: 'layouts/modals/window.html'  };

    // Merge required and arbitrary options together
    angular.extend(modalOptions, options);

    $modal.open(modalOptions).result.then(function(data) {
      queryService.removeParam(DIALOG_PARAM_NAME);
      $log.info('Dialog closed');
      q.resolve(data);
    }, function(reason) {
      queryService.removeParam(DIALOG_PARAM_NAME);
      $log.info('Dialog dismissed');
      q.reject(reason);
    });

    queryService.setValue(DIALOG_PARAM_NAME, dialogName);

    return q.promise;
  }

  // Accepting reservation data to be rendered in modal window
  function openCancelReservationDialog(reservation){
    return openDialog('CancelReservationDialog', 'layouts/modals/cancelReservationDialog.html', CONTROLLER_RESERVATIONS, {
      windowClass: 'is-wide has-white-bg',
      resolve: {reservation: function(){return reservation;}}
    });
  }

  function openCCVInfo(){
    return openDialog('CCVInfo', 'layouts/modals/ccvInfo.html', CONTROLLER_DEFAULT);
  }

  function openPoliciesInfo(product){
    return openDialog('PoliciesInfo', 'layouts/modals/policiesInfo.html', CONTROLLER_POLICY, {
      windowClass: 'is-wide',
      resolve: {
        data: function(){
          return product;
        }
      }
    });
  }

  function openPriceBreakdownInfo(roomDetails, product){
    return openDialog('PriceBreakdownInfo', 'layouts/modals/priceBreakdownInfo.html', CONTROLLER_DATA, {
      windowClass: 'is-wide',
      resolve: {
        data: function(){
          return {
            roomDetails: roomDetails,
            product: product
          };
        }
      }
    });
  }

  function openDialogIfPresent() {
    var dialogName = queryService.getValue(DIALOG_PARAM_NAME);
    switch (dialogName) {
    case '':
    case undefined:
      // do nothing
      break;
    case 'CancelReservationDialog':
      return openCancelReservationDialog();
    case 'CCVInfo':
      return openCCVInfo();
    case 'PoliciesInfo':
      return openPoliciesInfo();
    case 'PriceBreakdownInfo':
      return openPriceBreakdownInfo();
    default:
      // NOTE: Commenting this out. Logic must be reviewed
      //throw new Error('Unknown dialog "' + dialogName + '"');
    }
  }

  function openBadgesDialog(badges){
    return openDialog('Badges', 'layouts/modals/loyalties/badges.html', CONTROLLER_BADGES, {
      windowClass: 'dialog-badges',
      resolve: {
        data: function(){
          return badges;
        }
      }
    });
  }

  function openLoyaltyDialog(loyalty){
    return openDialog('Loyalties', 'layouts/modals/loyalties/loyalty.html', CONTROLLER_LOAYALTY, {
      windowClass: 'dialog-loyalty',
      resolve: {
        data: function(){
          return loyalty;
        }
      }
    });
  }

  function openGallery(images){
    return openDialog('openGallery', 'layouts/modals/imagesGallery.html', CONTROLLER_GALLERY, {
      windowClass: 'is-wide',
      resolve: {
        data: function(){
          return images;
        }
      }
    });
  }

  function openAssociatedRoomDetail(roomDetails, propertyCode) {
    return openDialog('associatedRooms', 'layouts/modals/associatedRooms.html', CONTROLLER_ASSOCIATED_ROOM, {
      windowClass: 'associated-rooms-modal',
      resolve: {
        data: function(){
          return roomDetails;
        },
        propertyCode: function(){
          return propertyCode;
        }
      }
    });
  }

  // Public methods
  return {
    openCancelReservationDialog: openCancelReservationDialog,
    openCCVInfo: openCCVInfo,
    openPoliciesInfo: openPoliciesInfo,
    openPriceBreakdownInfo: openPriceBreakdownInfo,
    openDialogIfPresent: openDialogIfPresent,
    // Loyalties
    openBadgesDialog: openBadgesDialog,
    openLoyaltyDialog: openLoyaltyDialog,
    // gallery
    openGallery: openGallery,
    openAssociatedRoomDetail: openAssociatedRoomDetail
  };
});
