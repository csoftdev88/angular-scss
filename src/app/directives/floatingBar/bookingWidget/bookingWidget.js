'use strict';

angular.module('mobiusApp.directives.floatingBar.bookingWidget', [])

.directive('bookingWidget', function($filter, $state, $window,
  modalService, bookingService, queryService, validationService,
  propertyService, locationService, filtersService, Settings, $q){
  return {
    restrict: 'E',
    scope: {
      advanced: '='
    },
    templateUrl: 'directives/floatingBar/bookingWidget/bookingWidget.html',

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
          'max': scope.settings.children.max,
          'min': scope.settings.children.min || 0,
          'defaultValue': 0,
          'required': false,
          'withCode': false
        },
        'adults': {
          'search': 'adults',
          'type': 'integer',
          'max': scope.settings.adults.max,
          'min': scope.settings.adults.min || 0,
          'required': true,
          'withCode': false
        },
        'location': {
          'search': 'location',
          'type': 'string',
          'required': false,
          'withCode': true
        },
        'property': {
          'search': 'property',
          'type': 'string',
          'required': false,
          'withCode': true
        },
        'promoCode': {
          'search': 'promoCode',
          'type': 'string',
          'required': false,
          'withCode': false
        },
        //TODO: add dates validation
        'dates': {
          'search': 'dates',
          'type': 'string',
          'required': true,
          'withCode': false
        },
        'rate': {
          'search': 'rate',
          'type': 'integer',
          'required': false,
          'withCode': false
        },

        'rooms': {
          'search': 'rooms',
          'type': 'object',
          'required': false,
          'withCode': false
        }
      };

      // NOTE: Hotel is presented in the URL by using property/hotel code
      // Currently selected form values
      scope.selected = {
        'children': undefined,
        'adults': undefined,
        'promoCode': '',
        'property': undefined,
        'location': undefined,
        // NOTE: dates might be presented as start/end date
        'dates': '',
        // Advanced options
        'rate': undefined
      };
      scope.locationPropertySelected = undefined;

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

      var locationsProperties = {};
      function init(){
        validateURLParams();

        if(!$window._.isEmpty(locationsProperties)){
          validatePropertyLocation();
        }else{
          // Getting a list of locations and properties
          $q.all([
            locationService.getAll(),
            propertyService.getAll()
          ]).then(function(data) {
            var locationData = data[0];
            var propertyData = data[1];

            // available locations of properties
            var locationCodes = $window._.reduce(propertyData, function(result, property){
              result[property.locationCode] = true;
              return result;
            }, {});

            // only locations of properties
            $window._.forEach(locationData, function(location) {
              if (locationCodes[location.code]) {
                locationsProperties[location.code] = location;
                locationsProperties[location.code].properties = $window._.filter(propertyData, {locationCode: location.code});
              }
            });

            validatePropertyLocation();
          });
        }

        if(scope.rates && scope.rates.length){
          validateRate();
        }else {
          filtersService.getProducts(true).then(function(data) {
            scope.rates = data || [];
            validateRate();
          });
        }
      }

      function validateRate() {
        var rateSettings = PARAM_TYPES.rate;
        var rateId = bookingService.getParams()[rateSettings.search];

        if(rateId) {
          var rate = $window._.find(scope.rates, {id: scope.selected.rate});
          // Checking whether list of rates has rate specified in the URL
          if(!rate) {
            // Property with the same name doesn't exist - URL param is invalid and should be removed.
            queryService.removeParam(rateSettings.search);
          } else {
            scope.selected.rate = rateId;
          }
        }
      }

      function findLocation(locationCode) {
        return $window._.find(locationsProperties, {code: locationCode});
      }

      function findProperty(propertyCode) {
        return $window._.chain(locationsProperties).pluck('properties').flatten().find({code: propertyCode}).value();
      }

      function validatePropertyLocation() {
        var propertySettings = PARAM_TYPES.property;
        var propertyCode = bookingService.getParams()[propertySettings.search];

        if(propertyCode) {
          // Checking whether list of properties has property specified in the URL
          scope.selected.property = findProperty(propertyCode);
          if(!scope.selected.property) {
            // Property with the same name doesn't exist - URL param is invalid and should be removed.
            queryService.removeParam(propertySettings.search);
          }
        }

        var locationSettings = PARAM_TYPES.location;
        var locationCode = bookingService.getParams()[locationSettings.search];

        if(locationCode) {
          if(!scope.selected.property || scope.selected.property.locationCode === locationCode) {
            // Checking whether list of locations has locaiton specified in the URL
            scope.selected.location = findLocation(locationCode);
          }
          if(!scope.selected.location) {
            // Location with the same name doesn't exist - URL param is invalid and should be removed.
            queryService.removeParam(locationSettings.search);
          }
        }

        setPropertyLocationList();
        if(scope.selected.property) {
          checkAvailability();
        } else {
          resetAvailability();
        }
      }

      function setPropertyLocationList() {
        if (scope.selected.location && scope.selected.location.code) {
          scope.propertyLocationList = [
            {name: 'All locations', type: 'all'},
            {name: location.name, type: 'location', code: location.code}
          ];
          $window._.forEach(scope.selected.location.properties, function(property) {
            scope.propertyLocationList.push({name: property.nameShort, type: 'property', code: property.code});
          });
        } else {
          scope.propertyLocationList = [];
          if (scope.settings.includeAllPropertyOption) {
            scope.propertyLocationList.push({name: 'All Properties', type: 'all'});
          }
          $window._.forEach(locationsProperties, function(location) {
            scope.propertyLocationList.push({name: location.name, type: 'location', code: location.code});
            $window._.forEach(location.properties, function(property) {
              scope.propertyLocationList.push({name: property.nameShort, type: 'property', code: property.code});
            });
          });
        }
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
          resetAvailability();
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

      scope.propertyLocationChanged = function() {
        switch(scope.locationPropertySelected.type) {
        case 'all':
          scope.selected.location = undefined;
          scope.selected.property = undefined;
          break;
        case 'location':
          scope.selected.location = findLocation(scope.locationPropertySelected.code);
          scope.selected.property = undefined;
          break;
        case 'property':
          scope.selected.property = findProperty(scope.locationPropertySelected.code);
          break;
        default:
          throw new Error('Undefined type: "' + scope.locationPropertySelected.type + '"');
        }
        setPropertyLocationList();
      };

      /**
       * Updates the url with values from the widget and redirects either to hotel list or a room list
       */
      scope.onSearch = function(){
        var stateParams = {};

        for(var key in PARAM_TYPES){
          var paramSettings = PARAM_TYPES[key];

          var modelValue;
          if(paramSettings.withCode && scope.selected[key]!==undefined){
            modelValue = scope.selected[key].code;
          } else {
            modelValue = scope.selected[key] || paramSettings.defaultValue;
          }

          if(validationService.isValueValid(modelValue, paramSettings)){
            var queryValue = validationService.convertValue(modelValue, paramSettings);
            //queryService.setValue(paramSettings.search, queryValue);
            stateParams[paramSettings.search] = queryValue;
          }else{
            queryService.removeParam(paramSettings.search);
            // NOTE: Angular doesn't clean the default qwery params when
            // navigating between states. Setting them to null solves
            // the issue.
            stateParams[paramSettings.search] = null;
          }
        }

        // Changing application state
        if(!scope.selected.property || !scope.selected.property.code){
          // 'All properties' is selected, will redirect to hotel list
          stateParams.property = null;
          $state.go('hotels', stateParams);
        } else{
          // Specific hotel selected, will redirect to room list
          stateParams.hotelCode = scope.selected.property.code;
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
