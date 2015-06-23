'use strict';

/**
 * Checkin date formatter filter
 */

angular.module('mobius.filters.checkInDate', [])

.filter('checkInDate', function($window, Settings) {
  return function(input) {
    if(!input){
      return '';
    }

    var diff = -$window.moment().diff(input);

    var outputFormat;

    for(var i = 0; i < Settings.UI.checkInDateFormats.rules.length; i++){
      var rule = Settings.UI.checkInDateFormats.rules[i];

      if(rule.min!==undefined && diff < rule.min){
        continue;
      }

      if(rule.max!==undefined && diff > rule.max){
        continue;
      }

      outputFormat = rule.format;
      break;
    }

    return $window.moment(input).format(outputFormat || Settings.UI.checkInDateFormats.defaultFormat);
  };
});
