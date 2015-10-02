'use strict';

/*globals Raven  */

angular.module('mobiusApp.services.exceptionHandler', []).factory('$exceptionHandler',
          ['$window', '$log',
  function ($window, $log) {
    if ($window.Raven) {
      //Raven.captureMessage("Initializing Raven ExceptionHandler");
      return function (exception) {
        $log.error.apply($log, arguments);
        Raven.captureException(exception);
      };
    } else {
      // jshint unused:true
      return function () {
        $log.error.apply($log, arguments);
      };
    }
  }
]);


