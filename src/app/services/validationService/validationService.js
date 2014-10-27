'use strict';

angular.module('mobiusApp.services.validation', [])
.service( 'validationService',  function() {

  function isQueryParamValid(paramSettings, paramValue){
    var value = convertValue(paramSettings, paramValue);

    if(value === undefined){
      return false;
    }

    switch(paramSettings.type){

    case 'integer':
      if(paramSettings.max!==undefined && value > paramSettings.max){
        return false;
      }

      if(paramSettings.min!==undefined && value < paramSettings.min){
        return false;
      }

      break;

    case 'string':
      if(paramValue===''){
        return false;
      }

      break;

    default:
      return false;

    }

    return true;
  }

  function convertValue(paramSettings, paramValue){
    switch(paramSettings.type){

    case 'integer':
      var parsedVal = parseInt(paramValue, 10);
      if(angular.isNumber(parsedVal)){
        return parsedVal;
      }

      break;

    case 'string':
      return paramValue;

    default:
      break;

    }

    return undefined;
  }

  // Public methods
  return {
    isQueryParamValid: isQueryParamValid,
    convertValue: convertValue
  };
});
