'use strict';

angular.module('mobiusApp.filters.mainHeaderStyle', [])

.filter('mainHeaderStyle' , function() {
  function filter(input) {

    if(!input){
      return '';
    }

    var ar = input.split(' ');
    var len = ar.length;
    var first = ar.shift();
    if(len > 2){
      var second = ar.shift();
    }
    var wrapped = '<strong>' + ar.join(' ') + '</strong>';
    return len > 2 ? (first + ' ' + second + ' ' + wrapped) : (first + ' ' + wrapped);

  }

  return filter;
});
