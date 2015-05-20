'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.properties', [])
.service( 'propertyService',  function(apiService) {

  function getAll(params){
    return apiService.get(apiService.getFullURL('properties.all', params));
  }

  // Public methods
  return {
    getAll: getAll
  };
});
