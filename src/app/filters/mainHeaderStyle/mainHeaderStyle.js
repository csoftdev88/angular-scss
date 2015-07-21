'use strict';
/**
 * Filter for wraping part of a string in strong tag
 * used for styling page headings
 */

angular.module('mobiusApp.filters.mainHeaderStyle', [])

.filter('mainHeaderStyle' , function() {
  function filter(input) {

    if(!input){
      return '';
    }

    var ar = input.split(' ');
    var len = ar.length;
    var first = ar.shift();
    var second = len > 2 ? ar.shift(): '';
    var wrapped = '<strong>' + ar.join(' ') + '</strong>';
    return len > 2 ? (first + ' ' + second + ' ' + wrapped) : (first + ' ' + wrapped);
    
  }

  return filter;
});
