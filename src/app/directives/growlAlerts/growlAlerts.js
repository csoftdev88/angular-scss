'use strict';

angular.module('mobiusApp.directives.growlAlerts', [])
  .directive('growlAlerts', ['growl', '$rootScope',
    function(growl, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          bookingMessage: '=',
          viewsMessage: '=',
          searchesMessage: '=',
          positionReference: '=',
          displayTime: '='
        },
        templateUrl: 'directives/growlAlerts/growlAlerts.html',

        link: function(scope) {
          var config = {
            referenceId: scope.positionReference ? scope.positionReference : 0,
            ttl: scope.displayTime ? scope.displayTime : 10000
          };

          $rootScope.$on('GROWL_ALERT', function (event, statistic) {
            growl.info(formatMessage(statistic), config);
          });

          function formatMessage(statistic){
            var message = '';
            switch(statistic.type) {
              case 'booking':
                message = scope.bookingMessage;
                break;
              case 'views':
                message = scope.viewsMessage;
                break;
              case 'searches':
                message = scope.searchesMessage;
                break;
              default:
                message = 'No message';
            }

            message = message.replace('{numTypes}', statistic.numTypes).replace('{numUnits}', statistic.numUnits).replace('{unit}', statistic.unit);

            return message;
          }
        }
      };
    }
  ]);
