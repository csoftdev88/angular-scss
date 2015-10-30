'use strict';

angular.module('mobiusApp.directives.floatingBar.bookingWidget', [])

.directive('bookingWidget', function($rootScope, $controller, $filter, $state, $window,
  $stateParams, $q, $timeout, modalService, bookingService, queryService, validationService,
  propertyService, locationService, filtersService, Settings){
  return {
    restrict: 'E',
    scope: {
      advanced: '=',
      hideBar: '&',
      openBookingTab: '='
    },
    templateUrl: 'directives/floatingBar/bookingWidget/bookingWidget.html',

    // Widget logic goes here
    link: function(scope){
      var DATE_FORMAT = 'YYYY-MM-DD';
      var CLASS_NOT_AVAILABLE = 'date-not-available';

      scope.codeTypes = [
        {
          title: 'Corporate Code',
          param: 'corpCode'
        },
        {
          title: 'Group Code',
          param: 'groupCode'
        },
        {
          title: 'Promo Code',
          param: 'promoCode'
        }
      ];

      $controller('GuestsCtrl', {$scope: scope});

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
          'field': 'value'
        },
        'adults': {
          'search': 'adults',
          'type': 'integer',
          'max': scope.settings.adults.max,
          'min': scope.settings.adults.min || 0,
          'required': true,
          'field': 'value'
        },
        'region': {
          'search': 'region',
          'type': 'string',
          'required': false,
          'field': 'code'
        },
        'property': {
          'search': 'property',
          'type': 'string',
          'required': false,
          'field': 'code'
        },
        // CODES
        'promoCode': {
          'search': 'promoCode',
          'type': 'string',
          'required': false,
          'field': ''
        },
        'corpCode': {
          'search': 'corpCode',
          'type': 'string',
          'required': false,
          'field': ''
        },
        'groupCode': {
          'search': 'groupCode',
          'type': 'string',
          'required': false,
          'field': ''
        },
        //TODO: add dates validation
        'dates': {
          'search': 'dates',
          'type': 'string',
          'required': true,
          'field': ''
        },
        'rate': {
          'search': 'rate',
          'type': 'integer',
          'required': false,
          'field': ''
        },

        'rooms': {
          'search': 'rooms',
          'type': 'object',
          'required': false,
          'field': ''
        }
      };

      function getDefaultAdultCount() {
        return $window._.find(scope.guestsOptions.adults, {
          value: bookingService.getAPIParams(true).adults || scope.settings.defaultAdultCount
        });
      }

      // NOTE: Hotel is presented in the URL by using property/hotel code
      // Currently selected form values
      scope.selected = {
        'adults': getDefaultAdultCount(),
        'children': scope.guestsOptions.children[0],
        'property': undefined,
        'location': undefined,
        'region': undefined,
        // NOTE: dates might be presented as start/end date
        'dates': '',
        // Advanced options
        'rate': undefined,
        'rooms': []
      };

      scope.regionPropertySelected = undefined;

      scope.canAddRoom = true;

      function canAddRoom() {
        //TODO  Multi room disabled for demo purposes
        var count = scope.selected.rooms.length;
        scope.canAddRoom = count < scope.settings.maxRooms;
      }

      // Function will remove query parameters from the URL in case their
      // values are not valid
      function validateURLParams(){
        var stateParams = bookingService.getParams();
        for(var key in PARAM_TYPES){
          if(PARAM_TYPES.hasOwnProperty(key)) {
            var paramSettings = PARAM_TYPES[key];

            var paramValue = stateParams[paramSettings.search];

            // URL parameter is presented but has no value
            if(paramValue === true || !validationService.isValueValid(paramValue, paramSettings)){
              queryService.removeParam(paramSettings.search);
            }else{
              // Value is valid, we can assign it to the model
              paramValue = validationService.convertValue(paramValue, paramSettings, true);
              switch(paramSettings.search){
              case 'adults':
                scope.selected[key] = valueToAdultsOption(paramValue);
                break;

              case 'children':
                scope.selected[key] = valueToChildrenOption(paramValue);
                break;

              case 'rooms':
                createRooms(paramValue);
                break;

              case 'promoCode':
              case 'groupCode':
              case 'corpCode':
                scope.selected[key] = paramValue;
                scope.selected.codeType = $window._.findWhere(scope.codeTypes, {param: key});
                break;
              default:
                scope.selected[key] = paramValue;
              }
            }
          }
        }

        // Detecting promo/group/corp codes
      }

      var regionsProperties = [];

      function init(){
        validateURLParams();

        //override/close keyboard on mobile when focusing on date input
        var rangeInput = $('#booking-widget-date-range');
        if (rangeInput.length) {
          rangeInput.focus(function(){
            $(this).blur();
          });
        }

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
                region.properties = $window._.chain(propertyData).filter(function(property) {
                  return property.regionCode === region.code;
                }).sortBy('nameShort').value();
                regionsProperties.push(region);
              }
            });
            regionsProperties = $window._.sortBy(regionsProperties, 'nameShort');
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

        // NOTE: Property dropdown is disable when reservationCode is presented
        // in the URL (reservation param)
        // TODO: NG-DISABLE DOESNT WORK
        scope.hasPropertySelection = !$stateParams.reservation;

        scope.singleProperty = Settings.UI.generics.singleProperty;

        if(!scope.selected.rooms || scope.selected.rooms.length < 2){
          scope.selected.rooms = [];
          // Minimal number of rooms for multiroom booking
          scope.addRoom(1,0);
          scope.addRoom(1,0);
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
          if((!scope.selected.property || scope.selected.property.regionCode === regionCode) && (!scope.selected.location || scope.selected.location.regionCode === regionCode)) {
            // Checking whether list of regions has locaiton specified in the URL
            scope.selected.region = findRegion(regionCode);
          }
          if(!scope.selected.region) {
            // Region with the same name doesn't exist - URL param is invalid and should be removed.
            queryService.removeParam(regionSettings.search);
          }
        }

        setPropertyRegionList();
        scope.checkAvailability();
      }

      function setPropertyRegionList() {
        var region = scope.selected.region;
        //var location = scope.selected.location;
        var property = scope.selected.property;

        scope.propertyRegionList = [];
        if (scope.settings.includeAllPropertyOption) {
          scope.propertyRegionList.push({name: 'All Properties', type: 'all'});
        }
        $window._.forEach(regionsProperties, function(region) {
          scope.propertyRegionList.push({name: region.nameShort, type: 'region', code: region.code});
          //$window._.forEach(region.locations, function(location) {
          //  scope.propertyRegionList.push({name: location.nameShort, type: 'location', code: location.code});
          $window._.forEach(region.properties, function(property) {
            scope.propertyRegionList.push({name: property.nameShort, type: 'property', code: property.code});
          });
        });

        if (property) {
          scope.regionPropertySelected = $window._.find(scope.propertyRegionList, {
            type: 'property',
            code: property.code
          });
        } else if (region) {
          scope.regionPropertySelected = $window._.find(scope.propertyRegionList, {
            type: 'region',
            code: region.code
          });
        }
        else{
          scope.regionPropertySelected = scope.propertyRegionList[0];
        }
      }

      scope.checkAvailability = function() {
        var dates = bookingService.datesFromString(scope.selected.dates);
        if (!scope.selected.property || !dates || !scope.selected.adults) {
          scope.availability = null;
          return;
        }

        var code = scope.selected.property.code || scope.selected.property;

        var params = {
          from: getAvailabilityCheckDate(dates.from, scope.settings.availability.from),
          to: getAvailabilityCheckDate(dates.to, scope.settings.availability.to),
          adults: scope.selected.adults.value,
          children: scope.selected.children ? scope.selected.children.value : 0,
          productGroupId: scope.selected.rate
        };

        var qBookingParam = $q.defer();

        // Using PGID from the booking params
        if(params.productGroupId){
          qBookingParam.resolve(params);
        } else {
          filtersService.getBestRateProduct().then(function(brp){
            if(brp){
              params.productGroupId = brp.id;
            }
            qBookingParam.resolve(params);
          });
        }

        return qBookingParam.promise.then(function(params) {
          return propertyService.getAvailability(code, params).then(function(data) {
            scope.availability = {};

            $window._.each(data, function(obj) {
              if (!obj.isInventory) {
                scope.availability[obj.date] = CLASS_NOT_AVAILABLE;
              }
            });
          }, function() {
            scope.availability = null;
          });
        });
      };

      function getAvailabilityCheckDate(date, modificationRule){
        date = modificationRule ?
          $window.moment(date).add(modificationRule.value, modificationRule.type).format(DATE_FORMAT)
          :
          date;

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
          scope.selected.location = undefined;
          scope.selected.property = undefined;
          break;
        case 'region':
          scope.selected.region = findRegion(scope.regionPropertySelected.code);
          scope.selected.location = undefined;
          scope.selected.property = undefined;
          break;

        case 'property':
          scope.selected.property = findProperty(scope.regionPropertySelected.code);
          $stateParams.property = scope.selected.property.code;
          break;
        default:
          throw new Error('Undefined type: "' + scope.regionPropertySelected.type + '"');
        }
        setPropertyRegionList();
      };

      scope.onCodeTypeChanged = function(){
        scope.selected.promoCode = null;
        scope.selected.groupCode = null;
        scope.selected.corpCode = null;
      };

      /**
       * Updates the url with values from the widget and redirects either to hotel list or a room list
       */
      scope.onSearch = function(){
        var stateParams = {};
        for (var key in PARAM_TYPES) {
          if (PARAM_TYPES.hasOwnProperty(key)) {
            var paramSettings = PARAM_TYPES[key];

            var modelValue = scope.selected[key];
            if (scope.selected[key] && paramSettings.field) {
              modelValue = modelValue[paramSettings.field];
            }
            modelValue = modelValue || paramSettings.defaultValue;

            if (key === 'rooms') {
              modelValue = roomsToNumbers(modelValue);
            }

            if (validationService.isValueValid(modelValue, paramSettings)) {
              var queryValue = validationService.convertValue(modelValue, paramSettings);
              //queryService.setValue(paramSettings.search, queryValue);
              stateParams[paramSettings.search] = queryValue;
            } else {
              queryService.removeParam(paramSettings.search);
              // NOTE: Angular doesn't clean the default qwery params when
              // navigating between states. Setting them to null solves
              // the issue.
              stateParams[paramSettings.search] = null;
            }
          }
        }

        // Changing application state
        if(!scope.advanced){
          // Removing rooms when not in multiroom booking mode
          stateParams.rooms = null;
          stateParams.room = null;
        }else{
          // Starting with first room
          var roomIndex = 1;
          stateParams.room = roomIndex;
          roomIndex--;
          var rooms = roomsToNumbers(scope.selected.rooms);
          if(rooms.length > roomIndex){
            stateParams.adults = rooms[roomIndex].adults;
            stateParams.children = rooms[roomIndex].children;
          }
          stateParams.promoCode = null;
          stateParams.corpCode = null;
          stateParams.groupCode = null;
        }

        if(!scope.selected.property || !scope.selected.property.code){
          // 'All properties' is selected, will redirect to hotel list
          stateParams.propertyCode = null;
          stateParams.fromSearch = '1';
          stateParams.scrollTo = 'hotels';
          if(Settings.UI.generics.singleProperty && $rootScope.propertySlug){
            stateParams.propertySlug = $rootScope.propertySlug;
            stateParams.scrollTo = 'jsRooms';
            $state.go('hotel', stateParams, {reload: true});
          }
          else{
            $state.go('hotels', stateParams, {reload: true});
          }
          
        } else if (scope.selected.property && scope.selected.property.code &&
                  scope.selected.dates && $stateParams.roomSlug) {
          //Redirect to Room Details to show rates
          stateParams.propertySlug = scope.selected.property.meta.slug;
          stateParams.fromSearch = '1';
          stateParams.roomSlug = $stateParams.roomSlug;
          $state.go('room', stateParams, {reload: true});
        } else {
          // Specific hotel selected, will redirect to room list
          stateParams.propertySlug = scope.selected.property.meta.slug;
          stateParams.fromSearch = '1';
          stateParams.scrollTo = 'jsRooms';
          $state.go('hotel', stateParams, {reload: true});
        }

        scope.hideBar();
      };

      // Search is enabled only when required fields contain data
      scope.isSearchable = function(){
        return scope.selected.property || scope.selected.dates;
      };

      scope.removeCode = function(){
        scope.selected.codeType = null;
        scope.selected.promoCode = null;
        scope.selected.corpCode = null;
        scope.selected.groupCode = null;
      };

      /*
      function recomputeGlobalAdultsChildren() {
        // TODO: FIX SUM
        function getSum(property) {
          return $window._.chain(scope.selected.rooms).pluck(property).reduce(function(acc, n) {
            return acc + n.value;
          }, 0).value();
        }

        scope.selected.adults = valueToAdultsOption(Math.max(scope.settings.adults.min, Math.min(scope.settings.adults.max, getSum('adults'))));
        scope.selected.children = valueToChildrenOption(Math.max(scope.settings.children.min, Math.min(scope.settings.children.max, getSum('children'))));
        scope.checkAvailability();
      }*/

      // NOTE: Matching values from URL to corresponding option
      // displayed in a dropdown
      function valueToAdultsOption(value){
        return $window._.find(scope.guestsOptions.adults, {value: value});
      }

      function valueToChildrenOption(value){
        return $window._.find(scope.guestsOptions.children, {value: value});
      }

      function roomsToNumbers(rooms) {
        return $window._.map(rooms, function(room) {
          return {
            adults: room.adults.value,
            children: room.children.value
          };
        });
      }

      function createRooms(rooms) {
        scope.selected.rooms = [];
        $window._.forEach(rooms, function(roomData) {
          scope.addRoom(roomData.adults, roomData.children);
        });
      }

      scope.addRoom = function(adults, children) {
        var room;
        if (!scope.selected.rooms) {
          if(!adults) {
            adults = scope.selected.adults.value;
          }
          if(!children) {
            children = scope.selected.children.value;
          }
          room = {adults: valueToAdultsOption(adults), children: valueToChildrenOption(children)};
          scope.selected.rooms = [room];
        } else if (scope.selected.rooms.length < scope.settings.maxRooms) {
          if(!adults) {
            adults = scope.settings.adults.min;
          }
          if(!children) {
            children = scope.settings.children.min;
          }
          room = {adults: valueToAdultsOption(adults), children: valueToChildrenOption(children)};
          scope.selected.rooms.push(room);
        }
        //room.unwatch = scope.$watch(function() { return room; }, recomputeGlobalAdultsChildren, true);
        //recomputeGlobalAdultsChildren();
        canAddRoom();
      };

      scope.removeRoom = function(i) {
        if (i >= 0 && i < scope.selected.rooms.length) {
          scope.selected.rooms.splice(i, 1);
          //room[0].unwatch();
          //recomputeGlobalAdultsChildren();
        }
        canAddRoom();
      };

      scope.getCurrentRate = function(){
        if(scope.selected.rate){
          var rate = $window._.findWhere(scope.rates, {id: parseInt(scope.selected.rate, 10)});
          return rate?rate.name:'';
        }

        return '';
      };

      scope.inputDateText = '';

      var routeChangeListener = scope.$on('$stateChangeSuccess', function(){
        init();
      });

      var prefillListener = $rootScope.$on('BOOKING_BAR_PREFILL_DATA', function(e, data){
        onPrefill(data);
      });

      var openMRBTabListener = $rootScope.$on('BOOKING_BAR_OPEN_MRB_TAB', function(){
        scope.openBookingTab(true);
      });

      scope.$on('$destroy', function(){
        routeChangeListener();
        prefillListener();
        openMRBTabListener();
      });

      function onPrefill(settings){
        if(settings.openBookingTab){
          scope.openBookingTab();
        }

        // TODO: Set code type from offers
        function prefillPromoCode() {
          scope.selected.promoCode = settings.promoCode;
          // TODO: Offers should have code types - needs API
          scope.selected.codeType = $window._.findWhere(scope.codeTypes, {param: 'promoCode'});

          var promoInput = angular.element('.booking-widget-promo-code');
          if (promoInput.length) {
            var prefilledClass = 'prefilled';
            promoInput.addClass(prefilledClass);

            // Removing class when animation complete
            $timeout(function () {
              promoInput.removeClass(prefilledClass);
            }, 1000);
          }
        }

        function removePromoCode() {
          scope.selected.promoCode = '';
          queryService.removeParam(PARAM_TYPES.promoCode.search);
        }

        $timeout(function () {
          if (settings.promoCode) {
            prefillPromoCode();
          } else {
            removePromoCode();
          }

          if (settings && settings.openDatePicker) {
            var rangeInput = angular.element('#booking-widget-date-range');
            if (rangeInput.length) {
              rangeInput.focus();
            }
          }
        }, 0);
      }

      // Init
      init();

    }
  };
});
