'use strict';

angular
  .module('mobiusApp.factories.spinner', [])
  .factory( 'spinnerService', fullScreenSpinner);

function fullScreenSpinner($rootScope) {
  $rootScope.spinner = {};
  return {
    startSpinner: startSpinner,
    stopSpinner: stopSpinner
  };

  function startSpinner(newMessage) {
    $rootScope.spinner.show = true;
    $rootScope.spinner.message = newMessage || '';
  }

  function stopSpinner() {
    $rootScope.spinner.show = false;
    $rootScope.spinner.message = '';
  }
}
