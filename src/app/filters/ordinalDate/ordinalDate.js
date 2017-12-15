'use strict';

/**
 * Filter for ordinal date using moment js lib.
 */

angular.module('mobiusApp.filters.ordinalDate', [])

.filter('ordinalDate', function($window) {
  return function(input, inputFormat) {
    if(!input){
      return '';
    }

    var outputFormat = 'Do';

    if(!inputFormat){
      inputFormat = 'YYYY-MM-DD';
    }

    return $window.moment(input, inputFormat).format(outputFormat);
  };
});
