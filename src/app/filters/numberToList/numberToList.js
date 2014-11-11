'use strict';

angular.module('mobiusApp.filters.list', [])

.filter('numberToList', function(){
  return function(input, length) {
      var items = [];
      for (var i = 0; i <= length; i++) {
        items.push(i);
      }

      return items;
    };
});
