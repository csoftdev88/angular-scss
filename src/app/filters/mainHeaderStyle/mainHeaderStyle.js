'use strict';
/*
 * Simple string truncate filter
 */
angular.module('mobiusApp.filters.mainHeaderStyle', [])

.filter('mainHeaderStyle' , function() {
  function filter(input) {

    if(!input){
      return '';
    }

    var ar = input.split(' ');
    var first = ar.shift();
    var wrapped = '<strong>' + ar.join(' ') + '</strong>';
    return first + ' ' + wrapped;

  }

  return filter;
});
