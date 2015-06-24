'use strict';
/*
* This service controls opening of all dialogs in the application
*/
angular.module('mobiusApp.services.modal', [])
.service( 'modalService',  function($modal, $q, $log, queryService) {
  var CONTROLLER_DEFAULT = 'ModalCtrl',
      CONTROLLER_DATA = 'ModalDataCtrl',
      CONTROLLER_POLICY = 'PolicyCtrl',
      CONTROLLER_BADGES = 'BadgesCtrl',
      CONTROLLER_ASSOCIATED_ROOM = 'AssociatedRoomCtrl',
      CONTROLLER_ADDON = 'AddonDetailCtrl',
      CONTROLLER_LOCATION = 'LocationDetailCtrl',

      DIALOG_PARAM_NAME = 'dialog';

  function openDialog(dialogName, templateUrl, controller, options){
    var q = $q.defer(),
        modalOptions = { templateUrl: templateUrl, controller: controller, windowTemplateUrl: 'layouts/modals/window.html'};

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
    return openDialog('CancelReservationDialog', 'layouts/modals/reservation/cancelReservationDialog.html', CONTROLLER_DATA, {
      windowClass: 'is-wide has-white-bg',
      resolve: {data: function(){return reservation;}}
    });
  }

  function openAddonDetailDialog(addAddon, addon){
    return openDialog('AddonDetailDialog', 'layouts/modals/reservation/addonDetailDialog.html', CONTROLLER_ADDON, {
      windowClass: 'is-wide has-white-bg',
      resolve: {
        addon: function(){return addon;},
        addAddon: function(){return addAddon;}
      }
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
      backdropClass: 'modal-footer',
      resolve: {
        data: function(){
          return badges;
        }
      }
    });
  }

  function openLoyaltyDialog(loyalty){
    return openDialog('Loyalties', 'layouts/modals/loyalties/loyalty.html', CONTROLLER_DATA, {
      windowClass: 'dialog-loyalty',
      backdropClass: 'modal-footer',
      resolve: {
        data: function(){
          return loyalty;
        }
      }
    });
  }

  function openGallery(images){
    return openDialog('openGallery', 'layouts/modals/imagesGallery.html', CONTROLLER_DATA, {
      windowClass: 'is-wide',
      resolve: {
        data: function(){
          return images;
        }
      }
    });
  }

  function openLocationDetail(location){
    return openDialog('openGallery', 'layouts/modals/locationDetail.html', CONTROLLER_LOCATION, {
      windowClass: 'is-wide',
      resolve: {
        data: function(){
          return location;
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
    openAddonDetailDialog: openAddonDetailDialog,
    openCCVInfo: openCCVInfo,
    openPoliciesInfo: openPoliciesInfo,
    openPriceBreakdownInfo: openPriceBreakdownInfo,
    openDialogIfPresent: openDialogIfPresent,
    // Loyalties
    openBadgesDialog: openBadgesDialog,
    openLoyaltyDialog: openLoyaltyDialog,
    // gallery
    openGallery: openGallery,
    openAssociatedRoomDetail: openAssociatedRoomDetail,
    openLocationDetail: openLocationDetail
  };
});
