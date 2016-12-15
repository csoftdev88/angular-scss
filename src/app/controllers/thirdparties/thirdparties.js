'use strict';
/*
 * This module controlls 3rd Parties page
 */
angular.module('mobius.controllers.thirdParties', [])
  .controller('ThirdPartiesCtrl', function($controller, $log, $scope, $state, $stateParams, $rootScope, $window, Settings, thirdPartiesService, _) {
    var vm = $scope;
    var codeTypesMap = {
      corp: 'corpCode',
      promo: 'promoCode',
      group: 'groupCode'
    };

    function setCode() {
      var settings = {
        fixedCodes: true
      };
      settings[vm.code.type] = vm.code.value;
      $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', settings);
      $stateParams.corpCode = vm.code.value;
    }

    function setInSession() {
      $rootScope.thirdparty.code = vm.code;
      var cookie = angular.copy($rootScope.thirdparty);
      $window.document.cookie = 'ActiveThirdParty' + '=' + angular.toJson(cookie) + '; path=/';
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
            setInSession();
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
          $state.go('home',$stateParams);
        });
    }

    if (Settings.UI.thirdparties.enable) {
      vm.code = {};
      $rootScope.thirdparty = {
        config: Settings.UI.thirdparties,
        heroContent: []
      };

      getThirdParties();
    } else {
      // Redirect to Home.
      $state.go('home',$stateParams);
    }
  });
