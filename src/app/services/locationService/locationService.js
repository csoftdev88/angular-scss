'use strict';
/*
 * This service gets available filters from the API
 */
angular.module('mobiusApp.services.locations', [])
  .service( 'locationService',  function($window, $q, apiService) {

    function getAll(params){
      return apiService.get(apiService.getFullURL('locations.all'), params);
    }

    // Public methods
    return {
      getAll: getAll
    };
  });
