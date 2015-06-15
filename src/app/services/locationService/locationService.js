'use strict';
/*
 * This service gets available filters from the API
 */
angular.module('mobiusApp.services.locations', [])
  .service( 'locationService',  function($window, $q, apiService) {

    function getLocations(params){
      return apiService.get(apiService.getFullURL('locations.locations'), params);
    }

    function getLocation(locationCode){
      return apiService.get(apiService.getFullURL('locations.location', {locationCode: locationCode}));
    }

    function getRegions(){
      return apiService.get(apiService.getFullURL('locations.regions'));
    }

    // Public methods
    return {
      getLocations: getLocations,
      getLocation: getLocation,
      getRegions: getRegions
    };
  });
