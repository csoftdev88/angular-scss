'use strict';

angular.module('mobiusApp.directives.booking', [])

.directive('bookingWidget', function($filter, queryService, validationService, propertyService, Settings){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/bookingWidget/bookingWidget.html',

    // Widget logic goes here
    link: function(scope){
      // Widget settings
      scope.settings = Settings.UI.bookingWidget;

      // NOTE: property is presented using property code

      // Currently selected form values
      scope.selected = {
        'children': undefined,
        'adults': undefined,
        'promoCode': '',
        'property': undefined,
        'startDate': undefined
      };

      // URL parameters and their settings
      var PARAM_TYPES = {
        'children': {
          'search': 'children',
          'type': 'integer',
          'max': scope.settings.maxChildren,
          'min': 0,
          'required': true
        },
        'adults': {
          'search': 'adults',
          'type': 'integer',
          'max': scope.settings.maxAdults,
          'min': 0,
          'required': true
        },
        'property': {
          'search': 'property',
          'type': 'string',
          'required': true
        },
        'promoCode': {
          'search': 'promoCode',
          'type': 'string',
          'required': false
        },
        'startDate': {
          'search': 'startDate',
          'type': 'string',
          'format': 'yyyy-MM-dd',
          'required': true
        }
      };

      // Function will remove query parameters from the URL in case their
      // values are not valid
      function validateURLParams(){
        for(var key in PARAM_TYPES){
          var paramSettings = PARAM_TYPES[key];

          var paramValue = queryService.getValue(paramSettings.search);

          // URL parameter is presented by has no value
          if(paramValue === true || !validationService.isValueValid(paramValue, paramSettings)){
            queryService.removeParam(paramSettings.search);
          }else{
            // Value is valid, we can assign it to the model
            scope.selected[key] = validationService.convertValue(paramValue, paramSettings);
          }
        }
      }


      // Init
      validateURLParams();

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
        scope.propertyList = data.properties || [];

        var paramSettings = PARAM_TYPES.property;
        var propertyCode = queryService.getValue(paramSettings.search);

        if(propertyCode===undefined){
          return;
        }

        // Checking whether list of properties has property specified in the URL
        for(var i=0; i<scope.propertyList.length; i++){
          var property = scope.propertyList[i];

          if(property.code === propertyCode){
            // Property exist
            scope.selected.property = property;
            return;
          }
        }

        // Property with the same name doesn't exist - URL param is invalid and should be removed.
        queryService.removeParam(paramSettings.search);
      });

      scope.onSearch = function(){
        // Updating URL params
        for(var key in PARAM_TYPES){
          var paramSettings = PARAM_TYPES[key];

          var modelValue;
          if(key === 'property' && scope.selected[key]!==undefined){
            modelValue = scope.selected[key].code;
          } else if(key === 'startDate'){
            modelValue = $filter('date')(scope.selected[key], paramSettings.format);
          }else{
            modelValue = scope.selected[key];
          }

          if(validationService.isValueValid(modelValue, paramSettings)){
            var paramValue = queryService.getValue(paramSettings.search);
            var queryValue = validationService.convertValue(paramValue, paramSettings);

            if(modelValue!==queryValue){
              queryService.setValue(paramSettings.search, modelValue);
            }

          }else{
            queryService.removeParam(paramSettings.search);
          }
        }
      };

      // Search is enabled only when required fields contains data
      scope.isSearchable = function(){
        for(var key in PARAM_TYPES){
          var settings = PARAM_TYPES[key];

          if(settings.required && !validationService.isValueValid(scope.selected[key], settings)){
            return false;
          }
        }

        return true;
      };
    }
  };
});
