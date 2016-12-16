'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.thirdPartiesService', [])
.service( 'thirdPartiesService',  function(apiService, $rootScope, $stateParams, $window, $state) {
  var codeTypesMap = {
    corp: 'corpCode',
    promo: 'promoCode',
    group: 'groupCode'
  };

  function getThirdPartiesByCode(code) {
    code = angular.isDefined(code) ? code : '';
    return apiService.get(apiService.getFullURL('thirdparties.get', {code: code}));
  }

  function setThirdParty(response){
    var res = response.thirdparty;
    var vm = {};
    vm.code = {
      type: codeTypesMap[res.type],
      value: res.code
    };

    $rootScope.thirdparty.heroContent = res.images;
    $rootScope.thirdparty.logo = res.logo;
    setCode(vm);
    setInSession(vm);
    $state.go('home',$stateParams);
  }

  function setCode(vm) {
    var settings = {
      fixedCodes: true
    };
    settings[vm.code.type] = vm.code.value;
    $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', settings);
    $stateParams.corpCode = vm.code.value;
  }

  function setInSession(vm) {
    $rootScope.thirdparty.code = vm.code;
    var cookie = angular.copy($rootScope.thirdparty);
    $window.document.cookie = 'ActiveThirdParty' + '=' + angular.toJson(cookie) + '; path=/';
  }

  // Public methods
  return {
    get: getThirdPartiesByCode,
    set: setThirdParty
  };
});
