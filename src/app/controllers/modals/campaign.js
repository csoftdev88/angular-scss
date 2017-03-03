'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.campaign', [
  'mobius.controllers.modals.generic',
  'mobius.controllers.common.sanitize'
])

.controller('CampaignCtrl', function($scope, $rootScope, $location, $modalInstance, $controller, data, cookieFactory, $window) {
  if(data && data.campaign){
    $scope.campaign = data.campaign;
  }
  $controller('SanitizeCtrl', {$scope: $scope});
  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.cancel = function() {
    updateCookie();
    $modalInstance.dismiss('cancel');
  };

  $scope.goToCampaign = function() {
    updateCookie();
    $location.path($rootScope.campaign.uri);
    $modalInstance.dismiss('cancel');
  };

  function updateCookie(){
    var activeCampaign = cookieFactory('MobiusActiveCampaign');
    var savedCampaign = activeCampaign !== null ? angular.fromJson(activeCampaign) : null;
    if(savedCampaign){
      savedCampaign.interstitialDismissed = true;
      $window.document.cookie = 'MobiusActiveCampaign' + '=' + angular.toJson(savedCampaign) + '; path=/';
    }
  }
});
