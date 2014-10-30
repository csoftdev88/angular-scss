'use strict';

angular.module('mobiusApp.services.validation', [])
.service( 'validationService',  function() {

  function isValueValid(paramValue, paramSettings){

    paramValue = convertValue(paramValue, paramSettings);

    if(paramValue === undefined){
      return false;
    }

    switch(paramSettings.type){

    case 'integer':
      // Range validation
      if(paramSettings.max!==undefined && paramValue > paramSettings.max){
        return false;
      }

      if(paramSettings.min!==undefined && paramValue < paramSettings.min){
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

  function convertValue(paramValue, paramSettings){
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
    convertValue: convertValue,
    isValueValid: isValueValid
  };
});
