'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.properties', [])
.service( 'propertyService',  function(apiService, $q) {

  var mock = {
     'name' : 'Queen room',
     'code' : 'QWN',
     'description' : 'Standard Room, 1 Queen bed, Sitting Area, Free Internet, Parking',
     'numberOfBeds' : 1,
     'maxGuests' : 2,
     'bedTypeName' : 'Queen',
     'priceFrom': 199,
     'size': {
       'from': 20,
       'to': 30,
       'unit': 'sq. feet'
     },
     'amenities' : [
       {'name': '24-hour coffee shop', 'icon': 'http://www.images.com/default11.jpg'},
       {'name': 'Parking', 'icon': 'http://www.images.com/default11.jpg'}
     ],
     'images' : [
       {
         'uri' : 'http://www.images.com/default11.jpg',
         'alt': 'picture1'
       },
       {
         'uri' : 'http://www.images.com/default12.jpg',
         'alt': 'picture2'
       }
     ],
     'IRI' : '/properties/ABB/rooms/QWN/'
   };

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

  function getRoomDetails(propertyCode, roomTypeCode){
    return $q.when(mock);
    /*
    var URL = apiService.getFullURL('properties.room.details', {
      propertyCode: propertyCode,
      roomTypeCode: roomTypeCode
    });
    return apiService.get(URL);
    */
  }

  function getRoomProductDetails(propertyCode, roomTypeCode, params){
    var URL = apiService.getFullURL('properties.room.productDetails', {
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
    getRoomDetails: getRoomDetails,
    getRoomProductDetails: getRoomProductDetails
  };
});
