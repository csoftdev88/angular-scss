'use strict';
/*
* This module controls a modal which displays a list of policies
*/
angular.module('mobius.controllers.modals.policy', [])

.controller( 'PolicyCtrl', function($scope, $controller, $modalInstance,
  Settings, data, $window) {

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
        if (Settings.UI.policies[policyCode]){
          result=Settings.UI.policies[policyCode];
        } else if (policyCodes[policyCode]){
          result=policyCodes[policyCode];
        } else {
          result=policyCode;
        }
        return result;
      };
  }
);
