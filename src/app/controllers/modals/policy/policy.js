'use strict';
/*
* This module controls a modal which displays a list of policies
*/
angular.module('mobius.controllers.modals.policy', [])

.controller( 'PolicyCtrl', function($scope, $controller, $modalInstance,
  Settings, data, $window, stateService, DynamicMessages) {

    //Get our dynamic translations
    var appLang = stateService.getAppLanguageCode();
    var dynamicMessages = DynamicMessages && DynamicMessages[appLang] ? DynamicMessages[appLang] : null;

    $controller('ModalDataCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data});
    $controller('SanitizeCtrl', {$scope: $scope});

    $scope.formatDate = function(date, format){
      return $window.moment(date).format(format);
    };

    $scope.getPolicyTitle = function(policyCode){
        var policyCodes={
            'cancel':'Cancellation',
            'cancellation':'Cancellation',
            'checkinout':'Check-In-Out',
            'commission':'Commission',
            'extraguests':'Extra Guest',
            'extraguest':'Extra Guest',
            'noshow':'No Show',
            'family':'Family',
            'guarantee':'Guarantee',
            'pet':'Pet'
          };
        var result;
        if(dynamicMessages && dynamicMessages[policyCode]){ //If translation exists for policy code title use this
          result = dynamicMessages[policyCode];
        } else if (Settings.UI.policies[policyCode]){
          result=Settings.UI.policies[policyCode].title;
        } else if (policyCodes[policyCode]){
          result=policyCodes[policyCode];
        } else {
          result=policyCode;
        }
        return result;
      };
  }
);
