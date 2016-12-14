'use strict';
/*
 * This module controlls 3rd Parties page
 */
angular.module('mobius.controllers.thirdParties', [])
  .controller('ThirdPartiesCtrl', function($controller, $log, $scope, $state, $stateParams, $rootScope, Settings, thirdPartiesService, _) {
    var vm = $scope;
    var codeTypesMap = {
      corp: 'corpCode',
      promo: 'promoCode',
      gourp: 'groupCode'
    };

    vm.code = {};
    $rootScope.thirdparty = {
      config: Settings.UI.thirdparties,
      heroContent: []
    };

    function setCode() {
      var settings = {
        fixedCodes: true
      };
      settings[vm.code.type] = vm.code.value;
      $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', settings);
    }

    function getThirdParties() {
      thirdPartiesService
        .get($stateParams.code)
        .then(function(res) {
          if (!_.isEmpty(res)) {
            vm.code = {
              type: codeTypesMap[res.type],
              value: res.code
            };

            $rootScope.thirdparty.heroContent = res.images;
            $rootScope.thirdparty.logo = res.logo;
            setCode();
          } else {
            $log.warn(code + 'is invalid');
            delete $rootScope.thirdparty;
          }
          // Redirect to Home.
          $state.go('home');
        })
        .catch(function(error) {
          $log.warn('There was an error while trying to fetch thirdparties', error);
          delete $rootScope.thirdparty;
          // Redirect to Home.
          $state.go('home');
        });
    }

    getThirdParties();
  });
