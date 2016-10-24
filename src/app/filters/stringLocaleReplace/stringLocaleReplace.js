'use strict';
/**
 * Filter for replacing vars on the locale string
 */

angular.module('mobiusApp.filters.stringLocaleReplace', [])

.filter('stringLocaleReplace' , function(Settings) {
  function filter(input, nameShort, nameLong, hotelName, reservationNumber) {
    if(!input){
      return '';
    }
    var chainPrefix = Settings.UI.hotelDetails.chainPrefix;
    input = input.replace('{chainPrefix}', chainPrefix).replace('{nameShort}', nameShort).replace('{nameLong}', nameLong).replace('{hotelName}', hotelName).replace('{reservationNumber}', reservationNumber);
    return input;
  }

  return filter;
});
