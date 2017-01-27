'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.thirdPartiesService', [])
.service( 'thirdPartiesService',  function(apiService, $rootScope, $stateParams, $window, $state, Settings) {
  var codeTypesMap = {
    corp: 'corpCode',
    promo: 'promoCode',
    group: 'groupCode'
  };

  function getThirdPartiesByCode(code) {
    code = angular.isDefined(code) ? code : '';
    return apiService.get(apiService.getFullURL('thirdparties.get', {code: code}));
  }

  function setThirdParty(response) {
    var res = response.thirdparty ? response.thirdparty : response;
    var vm = {};
    vm.code = {
      type: codeTypesMap[res.type],
      value: res.code
    };

    $rootScope.thirdparty = {
      config: Settings.UI.thirdparties,
      heroContent: res.images,
      logo: res.logo,
      title: res.title,
      description: res.description,
      properties: res.properties
    };

    setCode(vm);
    setInSession(vm);
    $stateParams[vm.code.type] = vm.code.value;
    $state.go('home',$stateParams);
  }

  function setCode(vm) {
    var settings = {
      fixedCodes: true
    };
    settings[vm.code.type] = vm.code.value;
    $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', settings);
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
