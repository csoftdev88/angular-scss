'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.thirdPartiesService', [])
.service( 'thirdPartiesService',  function(apiService) {
  function getThirdPartiesByCode(code) {
    code = angular.isDefined(code) ? code : '';
    return apiService.get(apiService.getFullURL('thirdparties.get', {code: code}));
  }

  // Public methods
  return {
    get: getThirdPartiesByCode
  };
});
