'use strict';
/**
 * Filter for wraping part of a string in strong tag
 * used for styling page headings
 */

angular.module('mobiusApp.filters.mainHeaderStyle', [])

.filter('mainHeaderStyle' , function() {
  function filter(input, wrap) {
    if(!input){
      return '';
    }
    wrap = (angular.isUndefined(wrap))?1:wrap;

    var words = input.split(' ');
    if(words.length > wrap){
      if(wrap === 1){
        words[words.length-wrap] = '<strong>' + words[words.length-wrap] + '</strong>';
      }else{
        words[words.length-wrap] = '<strong>' + words[words.length-wrap];
        words[words.length-1] = words[words.length-1] + '</strong>';
      }
    }
    return words.join(' ');
  }

  return filter;
});
