'use strict';

angular.module('mobiusApp.services.query', [])
.service( 'queryService',  function($location) {

  function removeParam(param){
    delete $location.$$search[param];
    $location.$$compose();
  }

  function getValue(param){
    return $location.search()[param];
  }

  function setValue(param, value){
    $location.search(param, value);
  }

  // Public methods
  return {
    removeParam: removeParam,
    getValue: getValue,
    setValue: setValue
  };
});
