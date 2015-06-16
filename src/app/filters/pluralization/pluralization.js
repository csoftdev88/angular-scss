'use strict';
/*
 * Simple pluralization filter.
 */
angular.module('mobiusApp.filters.pluralization', [])

.filter('pluralization' , function() {
  function filter(numberExp, rules) {
    if(numberExp !== undefined && rules){
      var expression = rules[numberExp] || rules.plural;
      if(expression){
        return expression.replace(/{}/g, numberExp);
      }
    }

    return '';
  }

  return filter;
});
