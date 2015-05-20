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

  var API_PARAM_FROM = 'from';
  var API_PARAM_TO = 'to';

  var DATES_SEPARATOR = ' ';

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

  function datesFromString(str){
    if(!str || str === ''){
      return null;
    }

    var dates = str.split(DATES_SEPARATOR);
    // TODO: Add validation
    return {
      from: dates[0],
      to: dates[1] || dates[0]
    };
  }

  // Returns query params in the format expected by the API
  function getAPIParams(){
    var params = getParams();

    var queryParams = {};
    $window._.each(params, function(value, key){
      if(!value){
        return;
      }

      if(key !== 'dates'){
        queryParams[QUERY_TO_API_PARAMS[key]] = value;
      }else{
        var dates = datesFromString(value);
        if(dates){
          queryParams[API_PARAM_FROM] = dates.from;
          queryParams[API_PARAM_TO] = dates.to;
        }
      }
    });

    return queryParams;
  }

  // Public methods
  return {
    getParams: getParams,
    getAPIParams: getAPIParams,
    datesFromString: datesFromString
  };
});
