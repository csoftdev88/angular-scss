'use strict';

angular.module('mobiusApp.directives.booking', [])

.directive('bookingWidget', function(queryService, validationService, propertyService, Settings){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/bookingWidget/bookingWidget.html',

    // Widget logic goes here
    link: function(scope){
      // Widget settings
      scope.settings = Settings.UI.bookingWidget;

      // Currently selected form values
      scope.selected = {
        'children': undefined,
        'adults': undefined,
        'promoCode': '',
        'property': undefined
      };

      // NODE: default property list
      // TODO: remove once mock API is working
      scope.propertyList = [
        'Abbotsford',
        'Blue River',
        'Cache Creek',
        'Calgary Airport'
      ];

      // URL parameters and their settings
      var PARAM_TYPES = {
        'children': {
          'search': 'children',
          'type': 'integer',
          'max': scope.settings.maxChildren,
          'min': 0
        },
        'adults': {
          'search': 'adults',
          'type': 'integer',
          'max': scope.settings.maxAdults,
          'min': 0
        },
        'property': {
          'search': 'property',
          'type': 'string'
        },
        'promoCode': {
          'search': 'promoCode',
          'type': 'string'
        }
      };

      // Function will remove query parameters from the URL in case their
      // values are not valid
      function validateParams(){
        for(var key in PARAM_TYPES){
          var paramSettings = PARAM_TYPES[key];

          var paramValue = queryService.getValue(paramSettings.search);

          // URL parameter is presented by has no value
          if(paramValue === true || !validationService.isQueryParamValid(paramSettings, paramValue)){
            queryService.removeParam(paramSettings.search);
          }else{
            // Value is valid, we can assign it to the model
            scope.selected[key] = validationService.getQueryParamValue(paramSettings, paramValue);
          }
        }
      }

      // Init
      validateParams();

      // Getting a list of properties
      propertyService.getAll().then(function(data){
        // NOTE: mock API has incorrectly formated JSON
        scope.propertyList = data;
      });
    }
  };
});
