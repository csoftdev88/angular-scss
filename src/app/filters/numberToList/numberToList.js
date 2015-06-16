'use strict';

angular.module('mobiusApp.filters.list', [])

.filter('numberToList', function(){
  return function(input, min, max) {
      var list = [];
      for (var i = min || 0; i <= max; i++) {
        list.push(i);
      }
      return list;
    };
});
