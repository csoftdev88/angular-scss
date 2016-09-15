'use strict';
/*
 * This service gets available filters from the API
 */
angular.module('mobiusApp.services.chains', [])
  .service( 'chainService',  function($window, $q, apiService) {

    function getChain(chainCode){
      return apiService.get(apiService.getFullURL('chain.get', {chainCode: chainCode}));
    }

    function getAll(){
      return apiService.get(apiService.getFullURL('chain.all'));
    }

    // Public methods
    return {
      getChain: getChain,
      getAll: getAll
    };
  });
