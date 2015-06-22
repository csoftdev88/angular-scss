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
    var URL = apiService.getFullURL('properties.room.product.all', {
      propertyCode: propertyCode,
      roomTypeCode: roomTypeCode
    });
    return apiService.get(URL, params);
  }

  function getRoomProductAddOns(propertyCode, roomTypeCode, productCode, params){
    var URL = apiService.getFullURL('properties.room.product.addons', {
      propertyCode: propertyCode,
      roomTypeCode: roomTypeCode,
      productCode: productCode
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
    getRoomProducts: getRoomProducts,
    getRoomProductAddOns: getRoomProductAddOns
  };
});
