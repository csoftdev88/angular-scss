'use strict';

/**
 * Directive to encapsulate member rate boxes
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
          $log.warn('No config for the questionnaire was provided!');
        }

        var size = attr.size || 'large';
        if(! _.contains(size, ['small', 'medium', 'large'])) {
          $log.warn('Invalid size attribute passed to the members rate directive');
        }

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


