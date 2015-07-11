'use strict';
/*
 * Simple string truncate filter
 */
angular.module('mobiusApp.filters.wrapword', [])

.filter('wrapWordHtml' , function() {
  function filter(input, tag, index) {
    if(!input){
      return '';
    }

    var ar = input.split(' ');
    var wrapped = '<' + tag + '>' + ar[index] + '</' + tag + '>';
    ar[index] = wrapped;
    return ar.join(' ');

  }

  return filter;
});
