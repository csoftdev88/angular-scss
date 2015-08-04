'use strict';
/*
* This service controls opening of all dialogs in the application
*/
angular.module('mobiusApp.services.modal', [])
.service( 'modalService',  function($modal, $q, $log, $window, $modalStack,
    Settings, queryService, _) {
  var CONTROLLER_DEFAULT = 'ModalCtrl',
      CONTROLLER_DATA = 'ModalDataCtrl',
      CONTROLLER_POLICY = 'PolicyCtrl',
      CONTROLLER_BADGES = 'BadgesCtrl',
      CONTROLLER_ADDON = 'AddonDetailCtrl',
      CONTROLLER_LOCATION = 'LocationDetailCtrl',
      CONTROLLER_CONFIRMATION = 'ConfirmationCtrl',

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

  function openCancelReservationDialog(reservationCode){
    // Accepting reservation data to be rendered in modal window
    return openDialog('CancelReservationDialog', 'layouts/modals/reservation/cancelReservationDialog.html', CONTROLLER_DATA, {
      windowClass: 'details confirmation-dialog',
      resolve: {data: function(){return reservationCode;}}
    });
  }

  function openModifyingReservationDialogue(reservationCode){
    return openDialog('reservation-modification', 'layouts/modals/reservation/modifyReservation.html', CONTROLLER_DATA, {
      windowClass: 'details reservation-modification',
      resolve: {
        data: function(){
          return {reservationCode: reservationCode};
        }
      }
    });
  }

  function openReservationModifyingDisabledDialogue(){
    return openDialog('reservation-modification', 'layouts/modals/reservation/cannotModify.html', CONTROLLER_DEFAULT, {
      windowClass: 'details reservation-modification'
    });
  }

  function openReservationCancelingDisabledDialogue(){
    return openDialog('reservation-modification', 'layouts/modals/reservation/cannotCancel.html', CONTROLLER_DEFAULT, {
      windowClass: 'details reservation-modification'
    });
  }

  function openReservationModificationCanceledDialogue(reservationCode){
    return openDialog('reservation-modification', 'layouts/modals/reservation/modificationCanceled.html', CONTROLLER_DATA, {
      windowClass: 'details reservation-modification',
      resolve: {
        data: function(){
          return {reservationCode: reservationCode};
        }
      }
    });
  }

  function openConfirmationDialog(setup) {
    return openDialog('ConfirmationDialog', 'layouts/modals/confirmationDialog.html', CONTROLLER_CONFIRMATION, {
      windowClass: 'details confirmation-dialog',
      resolve: {setup: function(){return setup;}}
    });
  }

  function openAddonDetailDialog(addAddon, addon, payWithPoints){
    return openDialog('AddonDetailDialog', 'layouts/modals/reservation/addonDetailDialog.html', CONTROLLER_ADDON, {
      windowClass: 'details addons',
      resolve: {
        addon: function(){return addon;},
        addAddon: function(){return addAddon;},
        payWithPoints: function(){return payWithPoints;}
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

  // rooms is an array of rooms and each room has _selectedProduct object with corresponding
  // product
  function openPriceBreakdownInfo(rooms){
    var totalAfterTax = _.reduce(
      _.map(rooms, function(room){
        return room._selectedProduct.price.totalAfterTax;
      }), function(t, n){
        return t + n;
      });

    return openDialog('PriceBreakdownInfo', 'layouts/modals/priceBreakdownInfo.html', CONTROLLER_DATA, {
      windowClass: 'is-wide',
      resolve: {
        data: function(){
          return {
            rooms: rooms,
            totalAfterTax: totalAfterTax
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
    case 'CCVInfo':
      return openCCVInfo();
    case 'PoliciesInfo':
      return openPoliciesInfo();
    default:
      // NOTE: Commenting this out. Logic must be reviewed
      //throw new Error('Unknown dialog "' + dialogName + '"');
    }
  }

  function openBadgesDialog(badges){
    // NOTE: We need to close other dialogues instances
    // since booking widget is not covered by a modal backdrop
    $modalStack.dismissAll();

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

  function openRewardDetailsDialog(reward){
    return openDialog('Rewards', 'layouts/modals/loyalties/rewardDetails.html', CONTROLLER_DATA, {
      windowClass: 'details dialog-rewards',
      resolve: {
        data: function(){
          function formatRewardName(rewardName) {
            var words = rewardName.split(' ');
            var lastWord = words.pop();
            return (words.join(' ') + ' <strong>' + lastWord + '</strong>');
          }
          reward.nameFormatted = formatRewardName(reward.name);
          return reward;
        }
      }
    });
  }

  function openLoyaltyDialog(loyalty){
    $modalStack.dismissAll();

    var position = 1;

    if(Settings.UI.myAccount && Settings.UI.myAccount.displaySettings){
      var items = Settings.UI.myAccount.displaySettings;

      if(items.profile){
        position++;
      }

      if(items.badges){
        position++;
      }
    }

    return openDialog('Loyalties', 'layouts/modals/loyalties/loyalty.html', CONTROLLER_DATA, {
      windowClass: 'dialog-loyalty' + (position?' position-' + position: ''),
      backdropClass: 'modal-footer',
      resolve: {
        data: function(){
          return loyalty;
        }
      }
    });
  }

  // NOTE: images - list of URLs
  function openGallery(images){
    return openDialog('openGallery', 'layouts/modals/lightbox.html', CONTROLLER_DATA, {
      windowClass: 'lightbox',
      backdropClass: 'modal-lightbox',
      resolve: {
        data: function(){
          return images.map(function(url){return {uri: url};});
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

  // NOTE: Same block should be used for other details dialogues but using a different template URL
  function openAssociatedRoomDetail(roomDetails) {
    return openDialog('openDetails', 'layouts/modals/associatedRooms.html', CONTROLLER_DATA, {
      windowClass: 'details',
      resolve: {
        data: function(){
          return roomDetails;
        }
      }
    });
  }

  function openTermsAgreeDialog() {
    return openDialog('openDetails', 'layouts/modals/reservation/termsAgreeDialog.html', CONTROLLER_DATA, {
      windowClass: 'details',
      resolve: {
        data: function(){
          return null;
        }
      }
    });
  }

  function openReservationLookupFailedDialog() {
    return openDialog('reservationLookupFailed', 'layouts/modals/reservation/reservationLookupFailed.html', CONTROLLER_DEFAULT, {
      windowClass: 'narrow',
      resolve: {
        data: function() {
          return null;
        }
      }
    });
  }

  function openReservationLookupLoginDialog() {
    return openDialog('reservationLookupLogin', 'layouts/modals/reservation/reservationLookupLogin.html', CONTROLLER_DEFAULT, {
      windowClass: 'narrow login',
      resolve: {
        data: function() {
          return null;
        }
      }
    });
  }

  function openRoomDetailsDialog(description) {
    return openDialog('room-details', 'layouts/modals/roomDetails.html', CONTROLLER_DATA, {
      windowClass: 'details',
      resolve: {
        data: function() {
          return description;
        }
      }
    });
  }

  function openOtherRoomsDialog(rooms) {
    return openDialog('other-rooms', 'layouts/modals/reservation/otherRooms.html', CONTROLLER_DATA, {
      windowClass: 'other-rooms details',
      resolve: {
        data: function() {
          return {
            rooms: rooms
          };
        }
      }
    });
  }

  // Prompt user to login/register when not logged in
  function openLoginDialog(){
    return openDialog('login-prompt', 'layouts/modals/loginPrompt.html', CONTROLLER_DATA, {
      windowClass: 'login-prompt',
      resolve: {
        data: function(){
          return {
            login: function(){
              $window.infiniti.api.login();
            }
          };
        }
      }
    });
  }

  // Public methods
  return {
    // Reservations
    openModifyingReservationDialogue: openModifyingReservationDialogue,
    openCancelReservationDialog: openCancelReservationDialog,
    openReservationModifyingDisabledDialogue: openReservationModifyingDisabledDialogue,
    openReservationCancelingDisabledDialogue: openReservationCancelingDisabledDialogue,
    openReservationModificationCanceledDialogue: openReservationModificationCanceledDialogue,
    openReservationLookupFailedDialog: openReservationLookupFailedDialog,
    openReservationLookupLoginDialog: openReservationLookupLoginDialog,

    openConfirmationDialog: openConfirmationDialog,
    openAddonDetailDialog: openAddonDetailDialog,
    openCCVInfo: openCCVInfo,
    openPoliciesInfo: openPoliciesInfo,
    openPriceBreakdownInfo: openPriceBreakdownInfo,
    openDialogIfPresent: openDialogIfPresent,
    // Loyalties
    openBadgesDialog: openBadgesDialog,
    openLoyaltyDialog: openLoyaltyDialog,
    // Rewards
    openRewardDetailsDialog: openRewardDetailsDialog,
    // gallery
    openGallery: openGallery,
    openAssociatedRoomDetail: openAssociatedRoomDetail,
    openLocationDetail: openLocationDetail,
    openTermsAgreeDialog: openTermsAgreeDialog,
    openRoomDetailsDialog: openRoomDetailsDialog,
    openOtherRoomsDialog: openOtherRoomsDialog,
    openLoginDialog: openLoginDialog
  };
});
