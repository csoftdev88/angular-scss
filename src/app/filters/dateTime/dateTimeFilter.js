'use strict';

/**
 * Filter for datetime coverting using
 * moment js lib.
 */

angular.module('mobius.filters.dateTime', [])

.filter('dateTime', function($window) {
  return function(input, outputFormat, inputFormat) {
    if(!outputFormat){
      outputFormat = 'DD MMM YY';
    }

    if(!inputFormat){
      inputFormat = 'YYYY-MM-DD';
    }

    return $window.moment(input, inputFormat).format(outputFormat);
  };
});
