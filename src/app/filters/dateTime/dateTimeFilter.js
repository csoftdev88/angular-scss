'use strict';

/**
 * Filter for datetime coverting using
 * moment js lib.
 */

angular.module('mobiusApp.filters.dateTime', [])

.filter('dateTime', function($window, Settings) {
  return function(input, outputFormat, inputFormat) {
    if(!input){
      return '';
    }

    if(!outputFormat){
      outputFormat = Settings.UI.generics.longDateFormat;
    }

    if(!inputFormat){
      inputFormat = 'YYYY-MM-DD';
    }

    return $window.moment(input, inputFormat).format(outputFormat);
  };
});
