'use strict';

angular.module('mobiusApp.directives.booking', [])

.directive('bookingWidget', function(queryService, propertyService, Settings){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/bookingWidget/bookingWidget.html',

    // Widget logic goes here
    link: function(scope){
      // Widget settings
      scope.settings = Settings.UI.bookingWidget;

      var PARAM_TYPES = {
        'children': {
          'param': 'children',
          'type': 'integer',
          'max': scope.settings.maxChildren
        },
        'adults': {
          'param': 'adults',
          'type': 'integer',
          'max': scope.settings.maxAdults
        },
        'property': {
          'param': 'property',
          'type': 'string'
        },
        'promoCode': {
          'param': 'promoCode',
          'type': 'string'
        }
      };

      propertyService.getAll().then(function(data){
        // NOTE: mock API has incorrectly formated JSON
        scope.propertyList = data;
      });

      scope.propertyList = [
        'Abbotsford',
        'Blue River',
        'Cache Creek',
        'Calgary Airport'
      ];

      function validateParams(){
        for(var key in PARAM_TYPES){
          var type = PARAM_TYPES[key];

          var paramValue = queryService.getValue(type.param);

          // URL parameter is presented by has no value
          if(paramValue === true || !isValid(type, paramValue)){
            queryService.removeParam(type.param);
          }else{

          }
        }
      }

      function isValid(type, value){
        switch(type.type){

        case 'integer':
          var parsedVal = parseInt(value, 10);
          if(!angular.isNumber(parsedVal)){
            return false;
          }

          if(type.max!==undefined && parsedVal > type.max){
            return false;
          }

          break;


        case 'string':
          if(value===''){
            return false;
          }

          break;

        default:
          return false;

        }

        return true;
      }

      // Init
      validateParams();
    }
  };
});
