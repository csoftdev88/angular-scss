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
        'region': {
          'search': 'region',
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
        'property': undefined,
        'region': undefined,
        // NOTE: dates might be presented as start/end date
        'dates': '',
        // Advanced options
        'promoCode': '',
        'rate': undefined,
        'rooms': []
      };
      scope.regionPropertySelected = undefined;

      scope.canAddRoom = true;
      function canAddRoom() {
        var count = scope.selected.rooms.length;
        scope.canAddRoom = count < scope.settings.maxRooms;
      }

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

      var regionsProperties = {};
      function init(){
        validateURLParams();

        if(!$window._.isEmpty(regionsProperties)){
          validatePropertyRegion();
        }else{
          // Getting a list of regions and properties
          $q.all([
            locationService.getRegions(),
            propertyService.getAll()
          ]).then(function(data) {
            var regionData = data[0];
            var propertyData = data[1];

            // available regions of properties
            var regionCodes = $window._.reduce(propertyData, function(result, property){
              result[property.regionCode] = true;
              return result;
            }, {});

            // only regions of properties
            $window._.forEach(regionData, function(region) {
              if (regionCodes[region.code]) {
                regionsProperties[region.code] = region;
                regionsProperties[region.code].properties = $window._.filter(propertyData, {regionCode: region.code});
              }
            });

            validatePropertyRegion();
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

      function findRegion(regionCode) {
        return $window._.find(regionsProperties, {code: regionCode});
      }

      function findProperty(propertyCode) {
        return $window._.chain(regionsProperties).pluck('properties').flatten().find({code: propertyCode}).value();
      }

      function validatePropertyRegion() {
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

        var regionSettings = PARAM_TYPES.region;
        var regionCode = bookingService.getParams()[regionSettings.search];

        if(regionCode) {
          if(!scope.selected.property || scope.selected.property.regionCode === regionCode) {
            // Checking whether list of regions has locaiton specified in the URL
            scope.selected.region = findRegion(regionCode);
          }
          if(!scope.selected.region) {
            // Region with the same name doesn't exist - URL param is invalid and should be removed.
            queryService.removeParam(regionSettings.search);
          }
        }

        setPropertyRegionList();
        if(scope.selected.property) {
          checkAvailability();
        } else {
          resetAvailability();
        }
      }

      function setPropertyRegionList() {
        scope.propertyRegionList = [];
        if (scope.settings.includeAllPropertyOption) {
          scope.propertyRegionList.push({name: 'All Properties', type: 'all'});
        }
        $window._.forEach(regionsProperties, function(region) {
          scope.propertyRegionList.push({name: region.nameShort, type: 'region', code: region.code});
          $window._.forEach(region.properties, function(property) {
            scope.propertyRegionList.push({name: property.nameShort, type: 'property', code: property.code});
          });
        });
        // TODO: on region page (Malta, Czech, etc.) show only properties of that region
        //if (scope.selected.region && scope.selected.region.code) {
        //  scope.propertyRegionList = [
        //    {name: 'All regions', type: 'all'},
        //    {name: region.name, type: 'region', code: region.code}
        //  ];
        //  $window._.forEach(scope.selected.region.properties, function(property) {
        //    scope.propertyRegionList.push({name: property.nameShort, type: 'property', code: property.code});
        //  });
        //} else {
        //}
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

      scope.propertyRegionChanged = function() {
        switch(scope.regionPropertySelected.type) {
        case 'all':
          scope.selected.region = undefined;
          scope.selected.property = undefined;
          break;
        case 'region':
          scope.selected.region = findRegion(scope.regionPropertySelected.code);
          scope.selected.property = undefined;
          break;
        case 'property':
          scope.selected.property = findProperty(scope.regionPropertySelected.code);
          break;
        default:
          throw new Error('Undefined type: "' + scope.regionPropertySelected.type + '"');
        }
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

      function recomputeGlobalAdultsChildren() {
        function getSum(property) {
          return $window._.chain(scope.selected.rooms).pluck(property).reduce(function(acc, n) {
            return acc + n;
          }, 0).value();
        }

        scope.selected.adults = Math.max(scope.settings.adults.min, Math.min(scope.settings.adults.max, getSum('adults')));
        scope.selected.children = Math.max(scope.settings.children.min, Math.min(scope.settings.children.max, getSum('children')));
      }

      scope.addRoom = function() {
        var room;
        if (!scope.selected.rooms) {
          room = {adults: scope.selected.adults, children: scope.selected.children};
          scope.selected.rooms = [room];
        } else if (scope.selected.rooms.length < scope.settings.maxRooms) {
          room = {adults: 1, children: 0};
          scope.selected.rooms.push(room);
        }
        room.unwatch = scope.$watch(function() { return room; }, recomputeGlobalAdultsChildren, true);
        canAddRoom();
      };

      scope.removeRoom = function(i) {
        if (i >= 0 && i < scope.selected.rooms.length) {
          var room = scope.selected.rooms.splice(i, 1);
          room[0].unwatch();
          recomputeGlobalAdultsChildren();
        }
        canAddRoom();
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
