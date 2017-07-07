'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.bookingBar', [])
    .directive('bookingBar', ['Settings', '$log', 'DynamicMessages','stateService', '$state', 'propertyService', '_', 'routerService',
                              BookingBar]);

  function BookingBar(Settings, $log, DynamicMessages, stateService, $state, propertyService, _, routerService) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/bookingBar/bookingBar.html',
      link: function (scope, elem, attrs) {
        var config = Settings.UI.bookingBar;
        if (!config) {
          $log.warn('No config for the recommendation was provided!');
        }
        var appLang = stateService.getAppLanguageCode();
        // Default search params, this is the object the booking form is bound to
        scope.search = {
          adults: 1,
          children: 0,
          codeType: 'default',
          property: 'default'
        };
        scope.adults = [];
        scope.children = [];
        scope.properties = [{
          $$hashKey: 'default',
          nameShort: DynamicMessages[appLang].select_property
        }];
        scope.showCode = false;
        // Create the size class used to determine which css selectors to use, small is the widget, large is the bar
        var size = attrs.size || config.defaultSize;
        scope.sizeClass = 'booking-bar__size-' + size;

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

        function formatSearchDates(start, end) {
          start = window.moment(start);
          end = window.moment(end);
          return start.format('YYYY-MM-DD') + '_' + end.format('YYYY-MM-DD');
        }

        function getProperty(key) {
          var property = _.findWhere(scope.properties, {$$hashKey: key});
          if (! property) {
            $log.warn('Potentially unexpected behaviour, the property was not found from its hash key.');
          }
          return property;
        }

        scope.doSearch = function () {
          // @todo Add here some kind of UI validation, make the fields red. Design input required
          if (scope.search.property === 'default') {
            return;
          }
          // Get the property object by looking it up by its hashKey from the select box
          var property = getProperty(scope.search.property);
          // Assign the property to the params being sent to the router service that will locate the region and location
          // slug for us
          var paramsData = {};
          paramsData.property = property;
          // Build the state params that gets passed to the hotel page and used by the filters
          var stateParams = {};
          stateParams.fromSearch = '1';
          stateParams.scrollTo = 'jsRooms';
          stateParams.rooms = null;
          stateParams.room = null;
          stateParams.adults = scope.search.adults;
          stateParams.children = scope.search.children;
          stateParams.dates = formatSearchDates(scope.search.checkIn, scope.search.checkOut);
          if (scope.search.code !== 'default') {
            stateParams[scope.search.codeType] = scope.search.code;
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

        // Initialise the date pickers
        $('#check-in').datepicker($.extend({}, $.datepicker.regional[stateService.getAppLanguageCode().split('-')[0]], {
          dateFormat: config.dateFormat,
          beforeShow: function (input, inst) {
            setTimeout(function () {
              inst.dpDiv.css({
                top: $("#check-in").offset().top + 35,
                left: $("#check-in").offset().left
              });
            }, 0);
          }
        }));
        $('#check-out').datepicker($.extend({}, $.datepicker.regional[stateService.getAppLanguageCode().split('-')[0]], {
          dateFormat: config.dateFormat
        }));
        // Set the check in and check out to be today and tomorrow if configured
        if (config.useTommorowDefault) {
          scope.search.checkIn = window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').format('DD MMMM YYYY');
          scope.search.checkOut = window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').add(1, 'days').format('DD MMMM YYYY');
        }
      }
    };
  }
}());

