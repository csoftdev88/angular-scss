'use strict';

angular.module('mobiusApp.services.query', [])
  .service('queryService', function ($location) {

    function removeParam(param) {
      delete $location.$$search[param];
      $location.$$compose();
    }

    function getValue(param) {
      return $location.search()[param];
    }

    function setValue(param, value) {
      $location.search(param, value);
    }

    function getQueryParameters(query) {
      if (!query) {
        return { };
      }

      return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce(function(params, param) {
          var arr = param.split('=');
          var key = arr[0];
          var value = arr[1];

          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          return params;
        }, { });
    }



    // Public methods
    return {
      removeParam: removeParam,
      getValue: getValue,
      setValue: setValue,
      getQueryParameters: getQueryParameters
    };
  });
