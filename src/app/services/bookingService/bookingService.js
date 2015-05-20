'use strict';
/*
 * Booking service retrieves booking settings
 * from the URL, does the validation etc.
 */
angular.module('mobiusApp.services.booking', [])

.service( 'bookingService',  function($stateParams, $window) {
  var QUERY_TO_API_PARAMS = {
    'property': 'productGroupId',
    'adults': 'adults',
    'children': 'children',
    'promoCode': 'promoCode'
  };

  function getParams(){
    var params = {
      property: $stateParams.hotelID || $stateParams.property,
      adults: $stateParams.adults,
      children: $stateParams.children,
      dates: $stateParams.dates,
      rate: $stateParams.rate,
      rooms: $stateParams.rooms,
      promoCode: $stateParams.promoCode
    };

    return params;
  }

  // Returns query params in the format expected by the API
  function getAPIParams(){
    var params = getParams();

    var queryParams = {};
    $window._.each(params, function(value, key){
      queryParams[QUERY_TO_API_PARAMS[key]] = value;
    });

    return queryParams;
  }

  // Public methods
  return {
    getParams: getParams,
    getAPIParams: getAPIParams
  };
});
