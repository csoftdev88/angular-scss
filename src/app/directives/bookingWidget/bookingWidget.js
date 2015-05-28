'use strict';

angular.module('mobiusApp.directives.booking', [])

.directive('bookingWidget', function($filter, $state, $window,
  modalService, bookingService, queryService, validationService,
  propertyService, Settings){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/bookingWidget/bookingWidget.html',

    // Widget logic goes here
    link: function(scope){
      var DATE_FORMAT = 'YYYY-MM-DD';
      var CLASS_NOT_AVAILABLE = 'date-not-available';

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
          'min': 1,
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

      // Function will remove query parameters from the URL in case their
      // values are not valid
      function validateURLParams(){
        var stateParams = bookingService.getParams();
        for(var key in PARAM_TYPES){
          var paramSettings = PARAM_TYPES[key];

          var paramValue = stateParams[paramSettings.search];

          // URL parameter is presented but has no value
          if(paramValue === true || !validationService.isValueValid(paramValue, paramSettings)){
            queryService.removeParam(paramSettings.search);
          }else{
            // Value is valid, we can assign it to the model
            scope.selected[key] = validationService.convertValue(paramValue, paramSettings, true);
          }
        }
      }

      function init(){
        validateURLParams();

        if(scope.propertyList && scope.propertyList.length){
          validateProperty();
        }else{
          // Getting a list of properties
          propertyService.getAll().then(function(data){
            scope.propertyList = data || [];
            validateProperty();
          });
        }
      }

      // Validating property code presented in the URL and selecting the corresponding
      // property
      function validateProperty(){
        var paramSettings = PARAM_TYPES.property;
        var propertyCode = bookingService.getParams()[paramSettings.search];

        if(!propertyCode){
          resetAvailability();
          return;
        }

        // Checking whether list of properties has property specified in the URL
        for(var i=0; i<scope.propertyList.length; i++){
          var property = scope.propertyList[i];

          if(property.code === propertyCode){
            // Property exist
            scope.selected.property = property;
            checkAvailability();
            return;
          }
        }

        resetAvailability();
        // Property with the same name doesn't exist - URL param is invalid and should be removed.
        queryService.removeParam(paramSettings.search);
      }

      function resetAvailability(){
        if(scope.availability){
          scope.availability = null;
        }
      }

      function checkAvailability(){
        // No need to check availability
        if(!scope.settings.availability){
          return;
        }

        var bookingParams = bookingService.getAPIParams(true);
        // NOTE - We have to check availability for wider range than selected
        bookingParams.from = getAvailabilityCheckDate(bookingParams.from,
          scope.settings.availability.from);

        bookingParams.to = getAvailabilityCheckDate(bookingParams.to,
          scope.settings.availability.to);

        propertyService.getAvailability(scope.selected.property.code, bookingParams).then(function(data){
          scope.availability = {};

          $window._.each(data, function(obj){
            if(!obj.isInventory){
              scope.availability[obj.date] = CLASS_NOT_AVAILABLE;
            }
          });
        }, function(){
          scope.resetAvailability();
        });
      }

      function getAvailabilityCheckDate(date, modificationRule){
        date = !modificationRule? date : $window.moment(date).add(modificationRule.value, modificationRule.type).
          format(DATE_FORMAT);

        // NOTE: Date must be eather today or a future date
        if($window.moment(date).valueOf() < $window.moment().valueOf()){
          date = $window.moment().format(DATE_FORMAT);
        }

        return date;
      }

      /**
       * Updates the url with values from the widget and redirects either to hotel list or a room list
       */
      scope.onSearch = function(){
        var stateParams = {};

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
            //queryService.setValue(paramSettings.search, queryValue);
            stateParams[paramSettings.search] = queryValue;
          }else{
            queryService.removeParam(paramSettings.search);
          }
        }

        // Changing application state
        if(!scope.selected.property){
          // 'All properties' is selected, will redirect to hotel list
          $state.go('hotels', stateParams);
        } else{
          // Specific hotel selected, will redirect to room list
          stateParams.hotelID = scope.selected.property.code;
          $state.go('hotel', stateParams);
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

      var routeChangeListener = scope.$on('$stateChangeSuccess', function(){
        init();
      });

      scope.$on('$destroy', function(){
        routeChangeListener();
      });

      // Init
      init();
    }
  };
});
