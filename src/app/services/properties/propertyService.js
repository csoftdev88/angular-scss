'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.properties', [])
.service( 'propertyService',  function(apiService) {

  function getAll(){
    return apiService.get(apiService.getFullURL('properties.all'));
  }

  // Public methods
  return {
    getAll: getAll
  };
});
