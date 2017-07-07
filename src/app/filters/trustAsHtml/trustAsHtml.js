'use strict';
/**
 * Filter for replacing vars on the locale string
 */

angular.module('mobiusApp.filters.trustAsHtml', [])

.filter('trustAsHtml' , function($sce, $log) {
  return function (text) {
    if (typeof text !== 'string') {
      $log.warn('Trust as html didnt get passed a string');
      return '';
    }
    return $sce.trustAsHtml(text);
  };
});
