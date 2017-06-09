'use strict';

angular.module('mobiusApp.directives.floatingBar.bookingWidget', [])

.directive('bookingWidget', function($rootScope, $controller, $filter, $state, $window,
  $stateParams, $q, $timeout, modalService, bookingService, queryService, validationService,
  propertyService, locationService, filtersService, Settings, _, contentService, stateService, routerService, deviceDetector){
  return {
    restrict: 'E',
    scope: {
      advanced: '=',
      hideBar: '&',
      openBookingTab: '='
    },
    templateUrl: 'directives/floatingBar/bookingWidget/bookingWidget.html',

    // Widget logic goes here
    link: function(scope, elem, attrs){
      var DATE_FORMAT = 'YYYY-MM-DD';
      var CLASS_NOT_AVAILABLE = 'date-not-available';
      var ALL_PROPERTIES = attrs.allProperties ? attrs.allProperties : 'All properties';
      var FIND_YOUR_HOTEL = 'Find Your Hotel';
      var floatingBarEl = $('floating-bar');

      scope.isMobile = function(){
        return stateService.isMobile();
      };

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
      scope.curDatePickerMonthDates = null;
      scope.canRemoveCodes = true;

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
        'location': {
          'search': 'location',
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

      var DATES_SEPARATOR = '_';

      //Get rates
      if(scope.settings.hasRatesSelection){
        filtersService.getProducts(true).then(function(data) {
          scope.rates = data || [];
        });
      }


      function getDefaultAdultCount() {
        return _.find(scope.guestsOptions.adults, {
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

              //If there is no property querystring value
              if(paramSettings.search === 'property'){
                //Get the property slug
                var propertySlug = bookingService.getParams().propertySlug;
                if(propertySlug){
                  //Get the property code from the slug and assign to the selected item in the booking bar;
                  var propertyCode = bookingService.getCodeFromSlug(propertySlug);
                  scope.selected[key] = propertyCode ? propertyCode : null;
                }
              }
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
                scope.selected.codeType = _.findWhere(scope.codeTypes, {param: key});
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
            //Fix to stop ipad scrolling to bottom of page and breaking datepicker
            if(!scope.isMobile() && deviceDetector.device === 'ipad')
            {
              $window.scrollTo(0, 0);
            }
          });
        }


        //Handle regions on
        if(!_.isEmpty(regionsProperties) && scope.settings.includeRegions){
          validatePropertyRegion();
        }else if(scope.settings.includeRegions && !scope.isMobile() || scope.settings.includeRegionsOnMobile && scope.isMobile()){
          // Getting a list of regions and properties
          $q.all([
            locationService.getRegions(),
            propertyService.getAll()
          ]).then(function(data) {
            var regionData = data[0];
            var propertyData = data[1];

            // available regions of properties
            var regionCodes = _.reduce(propertyData, function(result, property){
              result[property.regionCode] = true;
              return result;
            }, {});

            // only regions of properties
            _.forEach(regionData, function(region) {
              if (regionCodes[region.code]) {
                region.properties = _.chain(propertyData).filter(function(property) {
                  return property.regionCode === region.code;
                }).sortBy('nameShort').value();
                regionsProperties.push(region);
              }
            });
            regionsProperties = _.sortBy(regionsProperties, 'nameShort');
            validatePropertyRegion();
          });
        }

        //Handle locations
        if(!_.isEmpty(regionsProperties) && scope.settings.includeLocations){
          validatePropertyRegion();
        }else if(scope.settings.includeLocations && !scope.isMobile() || scope.settings.includeLocationsOnMobile && scope.isMobile()){
          // Getting a list of locations and properties
          $q.all([
            locationService.getLocations(),
            propertyService.getAll()
          ]).then(function(data) {
            var locationData = data[0];
            var propertyData = data[1];

            // available regions of properties
            var locationsCodes = _.reduce(propertyData, function(result, property){
              result[property.locationCode] = true;
              return result;
            }, {});

            // only regions of properties
            _.forEach(locationData, function(location) {
              if (locationsCodes[location.code]) {
                location.properties = _.chain(propertyData).filter(function(property) {
                  return property.locationCode === location.code;
                }).sortBy('nameShort').value();
                regionsProperties.push(location);
              }
            });
            regionsProperties = _.sortBy(regionsProperties, 'nameShort');
            validatePropertyRegion();
          });
        }

        //Handle properties only
        if(!_.isEmpty(regionsProperties) && !scope.settings.includeLocations && !scope.settings.includeRegions){
          validatePropertyRegion();
        }else if(!scope.settings.includeLocations && !scope.settings.includeRegions && !scope.isMobile() || !scope.settings.includeLocationsOnMobile && !scope.settings.includeRegionsOnMobile && scope.isMobile()){
          // Getting a list of properties
          propertyService.getAll().then(function(data) {
            regionsProperties = _.sortBy(data, 'nameShort');
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

        // Select today until tomorrow by default if configured
        if (Settings.UI.datepicker && Settings.UI.datepicker.showToday) {
          var startDate = new Date();
          var endDate = new Date();
          endDate.setDate(endDate.getDate() + 1);
          startDate = $.datepicker.formatDate( 'yy-mm-dd', new Date(startDate), {});
          endDate = $.datepicker.formatDate( 'yy-mm-dd', new Date(endDate), {});
          scope.selected.dates = startDate + DATES_SEPARATOR + endDate;
        }

      }

      function validateRate() {
        var rateSettings = PARAM_TYPES.rate;
        var rateId = bookingService.getParams()[rateSettings.search];

        if(rateId) {
          var rate = _.find(scope.rates, {id: scope.selected.rate});
          // Checking whether list of rates has rate specified in the URL
          if(!rate) {
            // Property with the same name doesn't exist - URL param is invalid and should be removed.
            queryService.removeParam(rateSettings.search);
          }
        }
      }

      function findRegion(code) {
        return _.find(regionsProperties, {code: code});
      }

      function findProperty(propertyCode) {
        if ((scope.settings.includeLocations || scope.settings.includeRegions) && !scope.isMobile() || (scope.settings.includeLocationsOnMobile || scope.settings.includeRegionsOnMobile) && scope.isMobile()) {
          return _.chain(regionsProperties).pluck('properties').flatten().find({code: propertyCode}).value();
        }
        else{
          return _.find(regionsProperties, {code: propertyCode});
        }
      }

      function validatePropertyRegion() {
        var propertySettings = PARAM_TYPES.property;
        var propertyCode = bookingService.getParams()[propertySettings.search];

        //If no property code in query string
        if(!propertyCode){
          //Get the property slug
          var propertySlug = bookingService.getParams().propertySlug;
          if(propertySlug){
            //Get the property code from the slug and set this as propertyCode
            propertyCode = bookingService.getCodeFromSlug(propertySlug);
          }
        }

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

        var locationSettings = PARAM_TYPES.location;
        var locationCode = bookingService.getParams()[locationSettings.search];

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

        if(locationCode) {
          if(!scope.selected.property || scope.selected.property.locationCode === locationCode) {
            // Checking whether list of regions has locaiton specified in the URL
            scope.selected.location = findRegion(locationCode);
          }
          if(!scope.selected.location) {
            // Region with the same name doesn't exist - URL param is invalid and should be removed.
            queryService.removeParam(locationSettings.search);
          }
        }

        setPropertyRegionList();
        scope.checkAvailability();
      }

      function setPropertyRegionList() {
        var region = scope.selected.region;
        var location = scope.selected.location;
        var property = scope.selected.property;

        scope.propertyRegionList = [];
        if (scope.settings.includeAllPropertyOption) {
          scope.propertyRegionList.push({name: FIND_YOUR_HOTEL, type: 'all'});
        }
        //regions
        if (scope.settings.includeRegions && !scope.isMobile() || scope.settings.includeRegionsOnMobile && scope.isMobile()) {
          _.forEach(regionsProperties, function(region) {
            if(regionsProperties.length > 1){
              scope.propertyRegionList.push({name: region.nameShort, type: 'region', code: region.code});
            }
            //_.forEach(region.locations, function(location) {
            //  scope.propertyRegionList.push({name: location.nameShort, type: 'location', code: location.code});
            _.forEach(region.properties, function(property) {
              scope.propertyRegionList.push({name: property.nameShort, type: 'property', code: property.code});
            });
          });
        }
        //locations
        if (scope.settings.includeLocations && !scope.isMobile() || scope.settings.includeLocationsOnMobile && scope.isMobile()) {
          _.forEach(regionsProperties, function(location) {
            if(regionsProperties.length > 1){
              scope.propertyRegionList.push({name: location.nameShort, type: 'location', code: location.code});
            }
            //_.forEach(region.locations, function(location) {
            //  scope.propertyRegionList.push({name: location.nameShort, type: 'location', code: location.code});
            _.forEach(location.properties, function(property) {
              scope.propertyRegionList.push({name: property.nameShort, type: 'property', code: property.code});
            });
          });
        }

        //properties only
        if (!scope.settings.includeLocations && !scope.settings.includeRegions && !scope.isMobile() || !scope.settings.includeLocationsOnMobile && !scope.settings.includeRegionsOnMobile && scope.isMobile()) {
          _.forEach(regionsProperties, function(property) {
            if(regionsProperties.length > 1){
              scope.propertyRegionList.push({name: property.nameShort, type: 'property', code: property.code});
            }
          });
        }

        if (property) {
          scope.regionPropertySelected = _.find(scope.propertyRegionList, {
            type: 'property',
            code: property.code
          });
        } else if (region) {
          scope.regionPropertySelected = _.find(scope.propertyRegionList, {
            type: 'region',
            code: region.code
          });
        }
        else if (location){
          scope.regionPropertySelected = _.find(scope.propertyRegionList, {
            type: 'location',
            code: location.code
          });
          /*
          locationService.getLocations().then(function(locations){
            var curLocation = _.find(locations, {
              code: location
            });
            scope.regionPropertySelected = {name: curLocation.nameShort, type: 'location', code: curLocation.code};
          });
          */

        }
        else{
          scope.regionPropertySelected = scope.propertyRegionList[0];
        }
      }

      $rootScope.$on('DATE_PICKER_MONTH_CHANGED', function(e, data){
        var year = data.selectedYear;
        var month = (parseInt(data.selectedMonth, 10) + 1).toString();
        month = month.length === 1 ? '0' + month : month;
        var fromDay = '01';
        var toDay = '02';
        var from = year + '-' + month + '-' + fromDay;
        var to = year + '-' + month + '-' + toDay;
        scope.curDatePickerMonthDates = from + DATES_SEPARATOR + to;
        scope.checkAvailability();
      });

      $rootScope.$on('DATE_PICKER_BEFORE_SHOW_DAY', function(e, day){
        if(scope.selectedOffer && scope.settings.checkOfferAvailabilityOnChange && scope.availability){
          if(!$window.moment(day).isBetween($window.moment(scope.selectedOffer.availableFrom).subtract(1, 'd'), scope.selectedOffer.availableTo, null, '[]')){
            scope.availability[$window.moment(day).format('YYYY-MM-DD')] = CLASS_NOT_AVAILABLE;
          }
        }
      });

      scope.checkAvailability = function() {

        //Check property availability on date picker change
        if(scope.settings.checkAvailabilityOnChange){
          var dates = bookingService.datesFromString(scope.curDatePickerMonthDates || scope.selected.dates);
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
            rate: scope.selected.rate.id
          };

          var qBookingParam = $q.defer();

          // Using PGID from the booking params
          if(params.rate){
            qBookingParam.resolve(params);
          } else {
            filtersService.getBestRateProduct().then(function(brp){
              if(brp){
                params.rate = brp.id;
              }
              qBookingParam.resolve(params);
            });
          }

          return qBookingParam.promise.then(function(params) {
            return propertyService.getAvailability(code, params).then(function(data) {
              scope.availability = {};

              _.each(data, function(obj) {
                if (!obj.isInventory) {
                  scope.availability[obj.date] = CLASS_NOT_AVAILABLE;
                }
              });
            }, function() {
              scope.availability = null;
            });
          });
        }

        //If offer code is selected, check offer availableFrom/availableTo
        if(scope.settings.checkOfferAvailabilityOnChange){
          var offerCode = scope.selected.promoCode || scope.selected.corpCode || scope.selected.groupCode;

          if(offerCode){
            contentService.getOffers().then(function(offers) {
              var index = _.findIndex(offers, {code: offerCode});
              if(index !== -1){
                scope.selectedOffer = offers[index];
                scope.availability = {};
              }
            });
          }
        }

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
        case 'location':
          scope.selected.location = findRegion(scope.regionPropertySelected.code);
          scope.selected.region = undefined;
          scope.selected.property = undefined;
          break;

        case 'property':
          scope.selected.property = findProperty(scope.regionPropertySelected.code);
          scope.selected.region = undefined;
          scope.selected.location = undefined;
          $stateParams.property = scope.regionPropertySelected.code;
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
        if($window.dataLayer)
        {
          $window.dataLayer.push({'event': 'bookingBarSearch'});
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
          console.log('rooms', rooms, scope.selected);
          console.log('state params', stateParams);
          if(rooms.length > roomIndex){
            stateParams.adults = rooms[roomIndex].adults;
            stateParams.children = rooms[roomIndex].children;
          }
          stateParams.promoCode = null;
          stateParams.corpCode = null;
          stateParams.groupCode = null;
        }

        //check if we should go to region/location/property/room
        stateParams.fromSearch = '1';
        var paramsData = {};
        console.log('state params', stateParams);

        if((!scope.selected.property || !scope.selected.property.code) && (!scope.selected.location || !scope.selected.location.code)){
          stateParams.propertyCode = null;
          stateParams.scrollTo = 'hotels';
          //If a single property or location is selected
          if(Settings.UI.generics.singleProperty && $rootScope.propertySlug){
            stateParams.propertySlug = $rootScope.propertySlug;
            stateParams.property = null;
            stateParams.scrollTo = 'jsRooms';
            scope.hideBar();
            console.log('state params', stateParams);
            $timeout(function () {
              $state.go('hotel', stateParams, {reload: true});
            }, 1000);
          }
          //Otherwise if "All properties" is selected
          else{
            //If a date is selected redirect to the hotels page
            if(scope.selected.dates) {
              stateParams.property = null;
              scope.hideBar();
              $timeout(function () {
                $state.go('allHotels', stateParams, {reload: true});
              }, 1000);
            }
            //Otherwise open the date picker
            else {
              //Call open date picker function on floating bar directive
              scope.$parent.openDatePicker();
            }
          }

        } else if (scope.selected.property && scope.selected.property.code &&
                  scope.selected.dates && $stateParams.roomSlug) {
          //Redirect to Room Details to show rates
          stateParams.roomSlug = $stateParams.roomSlug;
          paramsData.property =  scope.selected.property;
          routerService.buildStateParams('room', paramsData).then(function(params){
            stateParams = _.extend(stateParams, params);
            stateParams.property = null;
            scope.hideBar();
            $timeout(function () {
              $state.go('room', stateParams, {reload: true});
            }, 1000);
          });

        } else if (scope.selected.location && scope.selected.location.code &&
                  scope.selected.dates && $stateParams.roomSlug) {
          //Cannot access room without property
          stateParams.roomSlug = null;

          paramsData.location =  scope.selected.location;
          routerService.buildStateParams('hotels', paramsData).then(function(params){
            stateParams = _.extend(stateParams, params);
            stateParams.property = null;
            scope.hideBar();
            console.log('state params', stateParams);
            $timeout(function () {
              $state.go('hotels', stateParams, {reload: true});
            }, 1000);
          });


        } else if (scope.selected.location && scope.selected.location.code) {
          //Redirect to location hotels
          paramsData.location =  scope.selected.location;
          routerService.buildStateParams('hotels', paramsData).then(function(params){
            stateParams = _.extend(stateParams, params);
            stateParams.property = null;
            scope.hideBar();
            console.log('state params', stateParams);
            $timeout(function () {
              $state.go('hotels', stateParams, {reload: true});
            }, 1000);
          });


        } else {
          // Specific hotel selected, will redirect to room list
          //If dates are selected, scroll directly to rooms on property page
          if(scope.selected.dates){
            stateParams.scrollTo = 'jsRooms';
          }
          paramsData.property =  scope.selected.property;
          console.log('state params', stateParams);
          routerService.buildStateParams('hotel', paramsData).then(function(params){
            stateParams = _.extend(stateParams, params);
            stateParams.property = null;
            scope.hideBar();
            console.log('state params', stateParams);
            $timeout(function () {
              $state.go('hotel', stateParams, {reload: true});
            }, 1000);
          });

        }
      };

      // Search is enabled only when required fields contain data or if "All properties has been selected"
      scope.isSearchable = function(){
        return scope.selected.property || scope.selected.location || scope.selected.dates || (scope.propertyRegionList && scope.regionPropertySelected === scope.propertyRegionList[0] && scope.selected.allProperties);
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
          return _.chain(scope.selected.rooms).pluck(property).reduce(function(acc, n) {
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
        return _.find(scope.guestsOptions.adults, {value: value});
      }

      function valueToChildrenOption(value){
        return _.find(scope.guestsOptions.children, {value: value});
      }

      function roomsToNumbers(rooms) {
        return _.map(rooms, function(room) {
          return {
            adults: room.adults.value,
            children: room.children.value
          };
        });
      }

      function createRooms(rooms) {
        scope.selected.rooms = [];
        _.forEach(rooms, function(roomData) {
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
        if(scope.selected.rate && scope.settings.datePickerHasTitle){
          var rate = _.findWhere(scope.rates, {id: parseInt(scope.selected.rate, 10)});
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

      var openSRBTabListener = $rootScope.$on('BOOKING_BAR_OPEN_SRB_TAB', function(){
        scope.openBookingTab(false);
      });

      var selectAllPropertiesListener = $rootScope.$on('BOOKING_BAR_SELECT_ALL', function(){
        scope.propertyRegionList[0].name = ALL_PROPERTIES;
        scope.regionPropertySelected = scope.propertyRegionList[0];
        scope.selected.allProperties = true;
        scope.selected.region = undefined;
        scope.selected.location = undefined;
        scope.selected.property = undefined;
      });

      scope.$on('$destroy', function(){
        routeChangeListener();
        prefillListener();
        openMRBTabListener();
        selectAllPropertiesListener();
        openSRBTabListener();
      });

      function onPrefill(settings){
        if(settings.openBookingTab){
          var isMRB = $stateParams.rooms ? true : false;
          scope.openBookingTab(isMRB);
        }

        // TODO: Set code type from offers
        function prefillPromoCode() {
          // TODO: Offers should have code types - needs API
          var codeTypeParam;
          if(settings.promoCode){
            codeTypeParam = 'promoCode';
          }
          else if(settings.corpCode){
            codeTypeParam = 'corpCode';
          }
          else if(settings.groupCode){
            codeTypeParam = 'groupCode';
          }
          scope.selected[codeTypeParam] = settings.promoCode || settings.corpCode || settings.groupCode;
          scope.selected.codeType = _.findWhere(scope.codeTypes, {param: codeTypeParam});

          var promoInput = angular.element('.booking-widget-promo-code');
          if (promoInput.length) {
            var prefilledClass = 'prefilled';
            promoInput.addClass(prefilledClass);
            scope.checkAvailability();

            //Growl alerts for when a promoCode / corpCode / groupCode is prefilled.
            if(scope.settings.prefillGrowlAlert && codeTypeParam){
              scope.$emit('CODE_ADDED_GROWL_ALERT_EMIT', codeTypeParam);
            }

            if(!scope.settings.keepPrefillStyle){ //If option to keep the prefill style is not enabled
              $timeout(function () {
                promoInput.removeClass(prefilledClass); // Remove class when animation complete
              }, 1000);
            }
          }

          if (settings.fixedCodes) {
            scope.canRemoveCodes = !settings.fixedCodes;
          }
        }

        function removePromoCode() {
          scope.selected.promoCode = '';
          scope.selected.corpCode = '';
          scope.selected.groupCode = '';
          scope.selectedOffer = null;
          scope.availability = {};
          queryService.removeParam(PARAM_TYPES.promoCode.search);
        }

        $timeout(function () {
          if (settings.promoCode || settings.corpCode || settings.groupCode) {
            prefillPromoCode();
          } else if(!settings.keepPromoCode){
            removePromoCode();
          }

          if (settings && settings.openDatePicker) {
            //Ensure floating-bar is set to active if datepicker opened
            if(!floatingBarEl.hasClass('active')){
              floatingBarEl.addClass('active');
            }
            var rangeInput = angular.element('#booking-widget-date-range');
            if (rangeInput.length) {
              rangeInput.focus();
            }
          }

          //Prefill property from megamenu
          if (settings && settings.property) {
            scope.regionPropertySelected = {name: settings.property.nameShort, type: 'property', code: settings.property};
            scope.propertyRegionChanged();
          }
          //Prefill location from megamenu
          if (settings && settings.location) {
            scope.regionPropertySelected = {type: 'location', code: settings.location};
            scope.propertyRegionChanged();
          }
        }, 0);


      }

      // Init
      init();

    }
  };
});
