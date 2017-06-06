'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.bookingBar', [])
    .directive('bookingBar', ['Settings', '$log', 'DynamicMessages', 'stateService', BookingBar]);

  function BookingBar(Settings, $log, DynamicMessages, stateService) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/bookingBar/bookingBar.html',
      link: function (scope) {
        var config = Settings.UI.bookingBar;
        if (!config) {
          $log.warn('No config for the recommendation was provided!');
        }
        scope.search = {};
        scope.adults = [];
        scope.children = [];
        scope.showCode = false;
        var appLang = stateService.getAppLanguageCode();
        var i;
        // Load the adults and children options
        for (i = 1; i < config.maxAdults + 1; i++) {
          scope.adults.push({value: i, title: i.toString() + ' ' + DynamicMessages[appLang].adults});
        }
        for (i = 1; i < config.maxChildren + 1; i++) {
          scope.children.push({value: i, title: i.toString() + ' ' + DynamicMessages[appLang].children});
        }
        scope.codes = [
          {
            value: 'corp',
            name: 'Corporate Code'
          },
          {
            value: 'group',
            name: 'Group Code'
          },
          {
            value: 'promo',
            name: 'Promo Code'
          }
        ];
        scope.rooms = [
          {
            value: 'court',
            title: 'The Court'
          },
          {
            value: 'tuscany',
            title: 'Tuscany'
          }
        ];
        $('#check-in').datepicker($.extend({}, $.datepicker.regional[stateService.getAppLanguageCode().split('-')[0]], {
          dateFormat: config.dateFormat
        }));
        $('#check-out').datepicker($.extend({}, $.datepicker.regional[stateService.getAppLanguageCode().split('-')[0]], {
          dateFormat: config.dateFormat
        }));
      }
    };
  }
}());

