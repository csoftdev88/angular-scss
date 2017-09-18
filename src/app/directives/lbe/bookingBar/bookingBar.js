/**
 * Directive for the LBE as a replica to the floating bar's booking-widget.
 * TODO: work out if we still need this replica after the separation of templates per tenant?
 */
(function() {
  'use strict';

  angular
    .module('mobiusApp.directives.lbe.bookingBar', [])
    .directive('bookingBar', ['Settings', '$log', 'DynamicMessages','stateService', '$state', 'propertyService', '_',
                              'routerService', '$window', 'validationService', '$rootScope', '$stateParams',
                              BookingBar]);

  function BookingBar(Settings, $log, DynamicMessages, stateService, $state, propertyService, _, routerService,
                      $window, validationService, $rootScope, $stateParams) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/bookingBar/bookingBar.html',
      link: function (scope, elem, attrs) {
        var config = Settings.UI.bookingBar;
        if (!config) {
          $log.warn('No config for the recommendation was provided!');
        }
        scope.uiConfig = Settings.UI;
        var appLang = stateService.getAppLanguageCode();
        // Default search params, this is the object the booking form is bound to
        scope.search = {
          adults: 1,
          children: 0,
          codeType: 'default',
          property: 'default'
        };
        scope.dates = '';
        scope.adults = [];
        scope.children = [];
        scope.canAddRoom = true;
        scope.properties = [{
          id: 'default',
          nameShort: DynamicMessages[appLang].select_property
        }];
        scope.inputDateText = '';
        // Used to toggle the visibility of the code text input, as it should only show once a code type is selected
        scope.showCode = false;
        // Used to determine if searching for a single or multiroom booking
        scope.multiRoomSearch = false;
        // Create the size class used to determine which css selectors to use, small is the widget, large is the bar
        var size = attrs.size || config.defaultSize;
        scope.sizeClass = 'booking-bar__size-' + size;

        scope.rooms = [
          {
            adults: 1,
            children: 0
          }
        ];

        // Load the adults and children options
        var i;
        for (i = 1; i < config.maxAdults + 1; i++) {
          scope.adults.push({value: i, title: i.toString() + ' ' + (i === 1 ? DynamicMessages[appLang].adult : DynamicMessages[appLang].adults)});
        }
        for (i = 0; i < config.maxChildren + 1; i++) {
          scope.children.push({value: i, title: i.toString() + ' ' + (i === 1 ? DynamicMessages[appLang].child : DynamicMessages[appLang].children)});
        }
        scope.isSmall = function () {
          return size === 'small';
        };

        var datePickerListener = $rootScope.$on('OPEN_DATE_PICKER', function () {
          var rangeInput = angular.element('#booking-bar-dates');
          if (rangeInput.length) {
            rangeInput.focus();
          }
        });

        scope.openDatePicker = function () {
          $rootScope.$broadcast('OPEN_DATE_PICKER');
        };

        scope.$on('$destroy', function(){
          datePickerListener();
        });

        // Code types available to user
        scope.codes = [
          {
            title: 'Corporate Code',
            value: 'corpCode'
          },
          {
            title: 'Group Code',
            value: 'groupCode'
          },
          {
            title: 'Promo Code',
            value: 'promoCode'
          }
        ];

        // Retrieve property list for the select box
        propertyService.getAll()
          .then(function (properties) {
            scope.properties = _.extend(scope.properties, properties);
            // @todo Investigate why this needs to be wrapped in a timeOut
            setTimeout(function () {
              $("select[name='property']").trigger("chosen:updated");
            }, 0);
          });

        console.log('params', $stateParams);

        function initialiseValues() {
          if ($stateParams.adults) {
            scope.rooms[0].adults = parseInt($stateParams.adults, 10);
          }
          if ($stateParams.children) {
            scope.rooms[0].children = parseInt($stateParams.children, 10);
          }
          if ($stateParams.dates) {
            scope.dates = $stateParams.dates;
          }
          if ($stateParams.corpCode) {
            scope.search.codeType = scope.codes[1];
            scope.search.code = $stateParams.corpCode;
            scope.showCode = true;
          } else if ($stateParams.groupCode) {
            scope.search.codeType = scope.codes[2];
            scope.search.code = $stateParams.groupCode;
            scope.showCode = true;
          } else if ($stateParams.promoCode) {
            scope.search.codeType = scope.codes[3];
            scope.search.code = $stateParams.promoCode;
            scope.showCode = true;
          }
        }
        initialiseValues();

        function getProperty(id) {
          var property = Settings.UI.generics.singleProperty ?
            _.findWhere(scope.properties, {code: Settings.UI.generics.defaultPropertyCode}) :
            _.findWhere(scope.properties, {id: id});
          if (! property) {
            $log.warn('Potentially unexpected behaviour, the property was not found from its id.');
          }
          return property;
        }

        function buildSearchParams() {
          // Build the state params that gets passed to the hotel page and used by the filters
          var stateParams = {};
          stateParams.fromSearch = '1';
          stateParams.scrollTo = 'jsRooms';
          stateParams.rooms = null;
          stateParams.room = null;
          stateParams.adults = scope.rooms[0].adults;
          stateParams.children = scope.rooms[0].children;
          stateParams.dates = scope.dates;

          stateParams.promoCode = null;
          stateParams.corpCode = null;
          stateParams.groupCode = null;

          // Changing application state
          if (!scope.multiRoomSearch) {
            // Removing rooms when not in multiroom booking mode
            stateParams.rooms = null;
            stateParams.room = null;
            // N.B. Only single-room bookings can use codes
            if (scope.search.code) {
              stateParams[scope.search.codeType] = scope.search.code;
            }
          } else {
            stateParams.rooms = scope.rooms;
            stateParams.room = 1;
          }
          if ($stateParams.roomSlug) {
            stateParams.roomSlug = $stateParams.roomSlug;
          }
          return stateParams;
        }

        scope.addRoom = function () {
          scope.rooms.push({adults: 1, children: 0});
          scope.canAddRoom = scope.rooms.length < Settings.UI.bookingWidget.maxRooms;
        };

        scope.removeRoom = function (index) {
          if (scope.rooms.length > 1) {
            scope.rooms.splice(index, 1);
          }
          if (scope.rooms.length < 2) {
            scope.multiRoomSearch = false;
          }
          scope.canAddRoom = scope.rooms.length < Settings.UI.bookingWidget.maxRooms;
        };

        scope.switchSearchType = function () {
          scope.multiRoomSearch = !scope.multiRoomSearch;
          if (scope.multiRoomSearch) {
            scope.rooms = [
              {
                adults: 1,
                children: 0
              },
              {
                adults: 1,
                children: 0
              }
            ];
            return;
          }
          scope.rooms = [{
            adults: 1,
            children: 0
          }];
        };

        scope.removeCode = function () {
          scope.search.code = '';
          scope.search.codeType = null;
          scope.showCode = false;
        };

        scope.doSearch = function () {
          // @todo Add here some kind of UI validation, make the fields red. Design input required
          if ((scope.search.property === 'default' && !Settings.UI.generics.singleProperty) || scope.dates === '') {
            return;
          }
          // Get the property object by looking it up by its hashKey from the select box
          var property = getProperty(scope.search.property);
          // Assign the property to the params being sent to the router service that will locate
          // the region and location slug for us
          var paramsData = {
            property: property
          };
          // Push search event to data service
          if($window.dataLayer) {
            $window.dataLayer.push({'event': 'bookingBarSearch'});
          }
          // Create the search params
          var stateParams = buildSearchParams();

          // Convert rooms object so its URL compatible
          var roomSettings = {
            'search': 'rooms',
            'type': 'object',
            'required': false,
            'field': ''
          };
          if (validationService.isValueValid(stateParams.rooms, roomSettings)) {
            var queryValue = validationService.convertValue(stateParams.rooms, roomSettings);
            stateParams.rooms = queryValue;
          }
          // Default to the hotel page
          var page = 'hotel';
          // If the user is already on the room page, stay on this page
          if (stateParams.roomSlug) {
            page = 'room';
          }
          // The router service will locate the region and location slug for us based on the property in paramsData
          routerService.buildStateParams(page, paramsData).then(function(params) {
            // Combine the search params with the ones gotten from routerService
            stateParams = _.extend(stateParams, params);
            stateParams.property = null;
            // Navigate to the hotel page and pass the search data
            $state.go(page, stateParams, {reload: true});
          });
        };
      }
    };
  }
}());

