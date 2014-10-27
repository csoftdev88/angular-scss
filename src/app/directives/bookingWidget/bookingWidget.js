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
            scope.selected[key] = validationService.convertValue(paramSettings, paramValue);
          }
        }
      }


      // Init
      validateParams();

      // NOTE: This should be uncommented in case we want to update URL params once user
      // changed any of the form controls
      /*
      // List of model watchers
      //var watchers = [];

      // Changes in forms can be displayed in URL automatically
      function initModelWatchers(){
        for(var key in PARAM_TYPES){
          var paramSettings = PARAM_TYPES[key];

          // Creating model watchers
          var watcher = scope.$watch(
            'selected.'+key,
            onModelChanged(paramSettings)
          );

          watchers.push(watcher);
        }
      }

      // Model change watcher
      function onModelChanged(paramSettings){
        return function(newValue){
          // URL should be updated only when model value has changed
          var paramValue = queryService.getValue(paramSettings.search);
          var currentValue = validationService.convertValue(paramSettings, paramValue);

          if(currentValue!==newValue){
            queryService.setValue(paramSettings.search, newValue);
          }
        };
      }
      initModelWatchers();

      scope.$on('$destroy', function(){
        // Removing all model watchers
        for(var i=0; i < watchers.length; i++){
          watchers[i]();
        }
      });
      */

      // Getting a list of properties
      propertyService.getAll().then(function(data){
        // NOTE: mock API has incorrectly formated JSON
        scope.propertyList = data;
      });

      scope.onSearch = function(){
        // Updating URL params
        for(var key in PARAM_TYPES){
          var paramSettings = PARAM_TYPES[key];

          var paramValue = queryService.getValue(paramSettings.search);
          var queryValue = validationService.convertValue(paramSettings, paramValue);
          var modelValue = scope.selected[key];

          if(modelValue!==queryValue){
            queryService.setValue(paramSettings.search, modelValue);
          }
        }
      };
    }
  };
});
