'use strict';
/*
 * This module controlls 3rd Parties page
 */
angular.module('mobius.controllers.thirdParties', [])
  .controller('ThirdPartiesCtrl', function($controller, $log, $scope, $state, $stateParams, $rootScope, $window, Settings, thirdPartiesService, _, modalService) {
    var vm = $scope;

    function getThirdParties() {
      thirdPartiesService
        .get($stateParams.code)
        .then(function(res) {
          if (!_.isEmpty(res)) {
            if(res.key) {
              modalService.openPasswordDialog(res);
            }
            else {
              thirdPartiesService.set(res);
            }
          } else {
            $log.warn($stateParams.code + 'is invalid');
            delete $rootScope.thirdparty;
          }
          // Redirect to Home.
          $state.go('home',$stateParams);
        })
        .catch(function(error) {
          $log.warn('There was an error while trying to fetch thirdparties', error);
          delete $rootScope.thirdparty;
          // Redirect to Home.
          $state.go('home', $stateParams);
        });
    }

    if (Settings.UI.thirdparties.enable) {
      vm.code = {};
      getThirdParties();
    } else {
      // Redirect to Home.
      $state.go('home',$stateParams);
    }
  });
