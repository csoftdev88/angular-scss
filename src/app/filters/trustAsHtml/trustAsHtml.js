'use strict';
/**
 * Filter for replacing vars on the locale string
 */

angular.module('mobiusApp.filters.trustAsHtml', [])

.filter('trustAsHtml' , function($sce) {
  return function (text) {
    return $sce.trustAsHtml(text);
  };
});
