'use strict';

/**
 * Directive to encapsulate member rate boxes.
 *
 * The directive has 2 different types, small and large, passed by the attribute size
 * for example <members-rate size="small"> can be used when only 30% of the screen is available
 * Typically the small should be used for between 30% - 50% screen width and large for 50% up as these
 * have been tested with the default styles.
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.membersRate', [])
    .directive('membersRate', ['Settings', '$log', '_', MembersRate]);

  function MembersRate(Settings, $log, _) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/membersRate/membersRate.html',
      link: function (scope, elem, attr) {
        var config = Settings.UI.membersRate;
        if (!config) {
          $log.warn('No config for the members rate directive was provided!');
        }

        var size = attr.size || config.defaultSize;
        if(! _.contains(size, ['small', 'large'])) {
          $log.warn('Invalid size attribute passed to the members rate directive');
        }

        // @todo pull these from the API ??
        scope.sizeClass = 'members-rates__size-' + size;
        scope.rooms = [{
          title: 'The Court',
          tagline: 'Enjoy value and confort',
          rates: [
            {
              label: 'Members rates from',
              price: 149.15
            },
            {
              label: 'Public Rate',
              price: 169
            }
          ]
        },{
          title: 'The Tuscany',
          tagline: 'Your oasis in the city',
          rates: [
            {
              label: 'Members rates from',
              price: 149.15
            },
            {
              label: 'Public Rate',
              price: 169
            }
          ]
        }];
      }
    };
  }
}());


