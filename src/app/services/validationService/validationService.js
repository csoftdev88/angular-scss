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

    case 'object':
      return paramValue!==undefined || paramValue!==null;

    default:
      return false;
    }

    return true;
  }

  function convertValue(paramValue, paramSettings, decode){
    if(paramSettings === undefined){
      return;
    }

    switch(paramSettings.type){

    case 'integer':
      if(isNaN(paramValue)){
        return;
      }

      var parsedVal = parseInt(paramValue, 10);
      if(angular.isNumber(parsedVal)){
        return parsedVal;
      }

      break;

    case 'string':
      return paramValue;

    case 'object':
      var value;
      if(decode){
        try {
          value = JSON.parse(decodeURIComponent(paramValue));
        }catch(e){
          value = null;
        }
      }else{
        value = encodeURIComponent(JSON.stringify(paramValue));
      }

      return value;

    default:
      break;
    }

    return;
  }

  // Public methods
  return {
    convertValue: convertValue,
    isValueValid: isValueValid
  };
});
