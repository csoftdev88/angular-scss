'use strict';
/*
 * Simple string truncate filter
 */
angular.module('mobiusApp.filters.truncate', [])

.filter('truncateString' , function() {
  function filter(input, maxLength, mask) {
    if(!input){
      return '';
    }

    mask = mask || '...';

    if(input.length > maxLength){
      input = input.substring(0, maxLength - mask.length) + mask;
    }

    return input;
  }

  return filter;
});
