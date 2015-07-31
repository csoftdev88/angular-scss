'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.properties', [])
.service( 'propertyService',  function(apiService, $q) {

  function correctParams(params) {
    if (params && (!params.from || !params.to || !params.adults || !params.productGroupId)) {
      delete params.from;
      delete params.to;
      delete params.adults;
      delete params.children;
      delete params.productGroupId;
    }
    return params;
  }

  function getAll(params){
    return apiService.getThrottled(apiService.getFullURL('properties.all'), correctParams(params));
  }

  function getPropertyDetails(propertyCode, params){
    var URL = apiService.getFullURL('properties.details', {propertyCode: propertyCode});
    return apiService.get(URL, correctParams(params));
  }

  function getAvailability(propertyCode, params){
    var URL = apiService.getFullURL('properties.availability', {propertyCode: propertyCode});
    return apiService.get(URL, params);
  }

  function getRooms(propertyCode){
    var URL = apiService.getFullURL('properties.room.all', {
      propertyCode: propertyCode
    });
    return apiService.get(URL);
  }

  function getRoomDetails(propertyCode, roomTypeCode){
    var URL = apiService.getFullURL('properties.room.details', {
      propertyCode: propertyCode,
      roomTypeCode: roomTypeCode
    });
    return apiService.get(URL);
  }

  function getRoomProducts(propertyCode, roomTypeCode, params){
    if(!params || !params.from || !params.to) {
      return $q.when({});
    }
    var URL = apiService.getFullURL('properties.room.product.all', {
      propertyCode: propertyCode,
      roomTypeCode: roomTypeCode
    });
    return apiService.get(URL, params);
  }

  // Public methods
  return {
    getAll: getAll,
    getPropertyDetails: getPropertyDetails,
    getAvailability: getAvailability,
    getRooms: getRooms,
    getRoomDetails: getRoomDetails,
    getRoomProducts: getRoomProducts
  };
});
