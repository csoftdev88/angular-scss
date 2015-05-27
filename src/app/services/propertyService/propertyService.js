'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.properties', [])
.service( 'propertyService',  function(apiService) {

  function getAll(params){
    return apiService.get(apiService.getFullURL('properties.all'), params);
  }

  function getPropertyDetails(propertyCode, params){
    var URL = apiService.getFullURL('properties.details', {propertyCode: propertyCode});
    return apiService.get(URL, params);
  }

  // Public methods
  return {
    getAll: getAll,
    getPropertyDetails: getPropertyDetails
  };
});
