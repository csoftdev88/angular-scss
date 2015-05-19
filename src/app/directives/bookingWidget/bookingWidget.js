'use strict';

angular.module('mobiusApp.directives.booking', [])

.directive('bookingWidget', function($filter, modalService, queryService, validationService,
  propertyService, Settings){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/bookingWidget/bookingWidget.html',

    // Widget logic goes here
    link: function(scope){
      // Widget settings
      scope.settings = Settings.UI.bookingWidget;

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
          'required': false
        },
        'promoCode': {
          'search': 'promoCode',
          'type': 'string',
          'required': false
        },
        //TODO: add dates validation
        'dates': {
          'search': 'dates',
          'type': 'string',
          'required': true
        },
        'rate': {
          'search': 'rate',
          'type': 'integer',
          'required': false
        },

        'rooms': {
          'search': 'rooms',
          'type': 'object',
          'required': false
        }
      };

      // NOTE: Hotel is presented in the URL by using property/hotel code
      // Currently selected form values
      scope.selected = {
        'children': undefined,
        'adults': undefined,
        'promoCode': '',
        'property': undefined,
        // NOTE: dates might be presented as start/end date
        'dates': '',
        // Advanced options
        'rate': undefined
      };

      //scope.advancedOptions = {};

      // Function will remove query parameters from the URL in case their
      // values are not valid
      function validateURLParams(){
        for(var key in PARAM_TYPES){
          var paramSettings = PARAM_TYPES[key];

          var paramValue = queryService.getValue(paramSettings.search);

          // URL parameter is presented but has no value
          if(paramValue === true || !validationService.isValueValid(paramValue, paramSettings)){
            queryService.removeParam(paramSettings.search);
          }else{
            // Value is valid, we can assign it to the model
            scope.selected[key] = validationService.convertValue(paramValue, paramSettings, true);
          }
        }
      }

      // Init
      validateURLParams();

      // Getting a list of properties
      propertyService.getAll().then(function(data){
        scope.propertyList = data || [];

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

      /**
       * Updates the url with values from the widget and redirects either to hotel list or a room list
       */
      scope.onSearch = function(){
        if(!scope.selected.property){
          // 'All properties' is selected, will redirect to hotel list
        } else{
          // Specific hotel selected, will redirect to room list
        }

        // Updating URL params
        for(var key in PARAM_TYPES){
          var paramSettings = PARAM_TYPES[key];

          var modelValue;
          if(key === 'property' && scope.selected[key]!==undefined){
            modelValue = scope.selected[key].code;
          } else {
            modelValue = scope.selected[key];
          }

          if(validationService.isValueValid(modelValue, paramSettings)){
            var queryValue = validationService.convertValue(modelValue, paramSettings);
            queryService.setValue(paramSettings.search, queryValue);
          }else{
            queryService.removeParam(paramSettings.search);
          }
        }
      };

      // Search is enabled only when required fields contain data
      scope.isSearchable = function(){
        for(var key in PARAM_TYPES){
          var settings = PARAM_TYPES[key];

          var value = scope.selected[key];
          if(key === 'property'){
            continue;
          }

          if(settings.required && !validationService.isValueValid(value, settings)){
            return false;
          }
        }

        return true;
      };

      scope.openAdvancedOptionsDialog = function() {
        var advancedOptions = {};

        if(scope.selected.rate){
          advancedOptions.rate = scope.selected.rate;
        }

        if(scope.selected.rooms && scope.selected.rooms.length){
          advancedOptions.rooms = scope.selected.rooms;
          advancedOptions.multiRoom = true;
        }

        modalService.openAdvancedOptionsDialog(advancedOptions).then(function(data) {
          // Saving advanced options
          if(data.rate !== null) {
            scope.selected.rate = data.rate;
          }

          // Update number of adults and children when these are specified in multiroom selection
          if(data.rooms && data.rooms.length) {
            scope.selected.rooms = data.rooms;
            // TODO: Check if advanced options affect the number of adults/children
            scope.selected.adults = data.rooms.reduce(function(prev, next) {return prev + next.adults;}, 0);
            scope.selected.children = data.rooms.reduce(function(prev, next) {return prev + next.children;}, 0);
          }
        });
      };
    }
  };
});
