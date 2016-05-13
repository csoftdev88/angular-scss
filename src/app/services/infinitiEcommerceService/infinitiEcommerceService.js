'use strict';
/*
 * This service handles mobius rate search and product purchase tracking
 */
angular.module('mobiusApp.services.infinitiEcommerceService', [])
  .service( 'infinitiEcommerceService',  function() {

    function trackAnon(){

    }

    // Public methods
    return {
      trackAnon: trackAnon
    };
  });
