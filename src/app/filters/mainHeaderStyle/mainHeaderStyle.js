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

    var words = input.split(' ');
    if(words.length > 1){
      words[words.length-1] = '<strong>' + words[words.length-1] + '</strong>';
    }
    return words.join(' ');
  }

  return filter;
});
