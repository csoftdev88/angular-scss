'use strict';
/*
* This service for dataLayer/Google tag manager
*/
angular.module('mobiusApp.services.dataLayer', [])
.service( 'DataLayerService',  function($window, Settings) {
  function getDataLayer(){
    return Settings.API.useEcommerceDataLayer? $window.dataLayer : [];
  }

  function setUserId(userId){
    getDataLayer().push({
      'userId' : userId,
      'event' : 'authentication'
    });
  }

  // Public methods
  return {
    setUserId: setUserId
  };
});
