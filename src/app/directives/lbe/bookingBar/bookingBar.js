'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.bookingBar', [])
    .directive('bookingBar', ['Settings', '$log', 'DynamicMessages','stateService', '$state', 'propertyService', '_',
                              'routerService', '$window', 'validationService', 'queryService', BookingBar]);

  function BookingBar(Settings, $log, DynamicMessages, stateService, $state, propertyService, _, routerService,
                      $window, validationService) {
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
        scope.properties = [{
          id: 'default',
          nameShort: DynamicMessages[appLang].select_property
        }];
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
          scope.adults.push({value: i, title: i.toString() + ' ' + DynamicMessages[appLang].adults});
        }
        for (i = 0; i < config.maxChildren + 1; i++) {
          scope.children.push({value: i, title: i.toString() + ' ' + DynamicMessages[appLang].children});
        }
        scope.isSmall = function () {
          return size === 'small';
        };

        // Code types available to user
        scope.codes = [
          {
            title: DynamicMessages[appLang].apply_code,
            value: 'default'
          },
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
            scope.properties = _.extend(properties, scope.properties);
            // @todo Investigate why this needs to be wrapped in a timeOut
            setTimeout(function () {
              $("select[name='property']").trigger("chosen:updated");
            }, 0);
          });

        function getProperty(id) {
          var property;
          if (Settings.UI.generics.singleProperty) {
            property = _.findWhere(scope.properties, {code: Settings.UI.generics.defaultPropertyCode});
            if (! property) {
              $log.warn('Potentially unexpected behaviour, the property was not found from its hash key.');
            }
            return property;
          }
          property = _.findWhere(scope.properties, {id: id});
          if (! property) {
            $log.warn('Potentially unexpected behaviour, the property was not found from its hash key.');
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
          stateParams.adults = scope.search.adults;
          stateParams.children = scope.search.children;
          stateParams.dates = scope.dates;
          if (scope.search.code !== 'default') {
            stateParams[scope.search.codeType] = scope.search.code;
          }
          // Changing application state
          if(!scope.multiRoomSearch) {
            // Removing rooms when not in multiroom booking mode
            stateParams.rooms = null;
            stateParams.room = null;
          } else {
            stateParams.rooms = scope.rooms;
            stateParams.room = 1;
            // Multi room bookings cannot use codes
            stateParams.promoCode = null;
            stateParams.corpCode = null;
            stateParams.groupCode = null;
          }
          return stateParams;
        }

        scope.addRoom = function () {
          scope.rooms.push({adults: 1, children: 0});
        };

        scope.removeRoom = function (index) {
          if (scope.rooms.length > 1) {
            scope.rooms.splice(index, 1);
          }
        };

        scope.switchSearchType = function () {
          scope.multiRoomSearch = !scope.multiRoomSearch;
          scope.rooms = [{
            adults: 1,
            children: 0
          }];
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
          var romSettings = {
            'search': 'rooms',
            'type': 'object',
            'required': false,
            'field': ''
          };
          if (validationService.isValueValid(stateParams.rooms, romSettings)) {
            var queryValue = validationService.convertValue(stateParams.rooms, romSettings);
            stateParams.rooms = queryValue;
          }
          // The router service will locate the region and location slug for us based on the property in paramsData
          routerService.buildStateParams('hotel', paramsData).then(function(params) {
            // Combine the search params with the ones gotten from routerService
            stateParams = _.extend(stateParams, params);
            stateParams.property = null;
            // Navigate to the hotel page and pass the search data
            $state.go('hotel', stateParams, {reload: true});
          });
        };
      }
    };
  }
}());

