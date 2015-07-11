'use strict';

angular.module('mobiusApp.filters.list', [
  'mobiusApp.filters.pluralization'
])

.filter('numberToList', function($filter){
  return function(input, min, max, pluralizationRules) {
      var list = [];

      var pluralizationFilter = pluralizationRules?$filter('pluralization'):null;

      for (var i = min || 0; i <= max; i++) {
        if(pluralizationFilter){
          list.push({
            value: i,
            title: pluralizationFilter(i, pluralizationRules)
          });
        }else{
          list.push(i);
        }
      }
      return list;
    };
});
