'use strict';
/*
 * Booking service retrieves booking settings
 * from the URL, does the validation etc.
 */
angular.module('mobiusApp.services.booking', [])

.service( 'bookingService',  function($stateParams, $window, $rootScope,
  validationService, Settings) {

  var QUERY_TO_API_PARAMS = {
    'property': 'propertyCode',
    'location': 'locationCode',
    'region': 'regionCode',
    'adults': 'adults',
    'children': 'children',
    'rate': 'productGroupId',
    'propertySlug': 'propertySlug',
    'roomSlug': 'roomSlug'
  };

  var API_PARAM_FROM = 'from';
  var API_PARAM_TO = 'to';
  var ROOMS_PARAM_SETTINGS = {type: 'object'};

  var DATES_SEPARATOR = ' ';

  function getParams(excludePropertyId){
    var params = {
      adults: $stateParams.adults,
      children: $stateParams.children,
      region: $stateParams.region,
      location: $stateParams.location,
      dates: $stateParams.dates,
      // rate is ProductGroupID from filters/product API
      rate: $stateParams.rate,
      rooms: $stateParams.rooms,
      propertySlug: $stateParams.propertySlug,
      roomSlug: $stateParams.roomSlug
    };

    if(!excludePropertyId){
      params.property = $stateParams.propertyCode || $stateParams.property;
    }

    if($stateParams.promoCode){
      params.promoCode = $stateParams.promoCode;
    }else if($stateParams.corpCode){
      params.corpCode = $stateParams.corpCode;
    }else if($stateParams.groupCode){
      params.groupCode = $stateParams.groupCode;
    }

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
  function getAPIParams(excludePropertyId){
    var params = getParams(excludePropertyId);

    var queryParams = {};
    $window._.each(params, function(value, key){
      if(!value){
        return;
      }

      if (key === 'dates') {
        var dates = datesFromString(value);
        if (dates) {
          queryParams[API_PARAM_FROM] = dates.from;
          queryParams[API_PARAM_TO] = dates.to;
        }
      } else if (key === 'promoCode') {
        queryParams[getCodeParamName(value)] = value;
      } else if (QUERY_TO_API_PARAMS[key]) {
        queryParams[QUERY_TO_API_PARAMS[key]] = value;
      }
    });

    return queryParams;
  }

  // Returns a property code out of propertySlug state parameter
  // NOTE: Slug contains `-` separators, code has only `_` and presented
  // in the end of slug string.
  function getCodeFromSlug(slug){
    if(slug){
      var codeStartIndex = slug.lastIndexOf('-');
      if(codeStartIndex !== -1 && codeStartIndex < slug.length - 1){
        return slug.substring(codeStartIndex + 1).toUpperCase().replace(/_/g, '-');
      }
      else{
        return slug.toUpperCase().replace(/_/g, '-');
      }
    }

    return null;
  }

  function APIParamsHasDates() {
    var queryParams = getAPIParams(true);
    return !!(queryParams[API_PARAM_FROM] && queryParams[API_PARAM_TO]);
  }

  function getCodeParamName(code) {
    if(/^#/.test(code)) {
      return 'groupCode';
    } else if(/^[0-9]/.test(code)) {
      return 'corpCode';
    } else {
      return 'promoCode';
    }
  }

  function isMultiRoomBooking(roomsStateObject){
    var rooms = getMultiRoomData(roomsStateObject);
    return !!(rooms && rooms.length);
  }

  function getMultiRoomData(roomsStateObject){
    return validationService.convertValue(
      roomsStateObject || $stateParams.rooms, ROOMS_PARAM_SETTINGS, true);
  }

  function isOverAdultsCapacity(){
    var params = getAPIParams();

    return Settings.UI.bookingWidget.maxAdultsForSingleRoomBooking &&
      !isMultiRoomBooking() &&
      params.from &&
      params.to &&
      params.adults > Settings.UI.bookingWidget.maxAdultsForSingleRoomBooking;
  }

  function isDateRangeSelected(){
    var params = getAPIParams();

    return params.from && params.to;
  }

  function switchToMRBMode(){
    $rootScope.$broadcast('BOOKING_BAR_OPEN_MRB_TAB');
  }

  // Public methods
  return {
    getParams: getParams,
    getAPIParams: getAPIParams,
    datesFromString: datesFromString,
    APIParamsHasDates: APIParamsHasDates,
    getCodeParamName: getCodeParamName,
    getCodeFromSlug: getCodeFromSlug,
    isMultiRoomBooking: isMultiRoomBooking,
    getMultiRoomData: getMultiRoomData,
    isOverAdultsCapacity: isOverAdultsCapacity,
    isDateRangeSelected: isDateRangeSelected,
    switchToMRBMode: switchToMRBMode
  };
});
