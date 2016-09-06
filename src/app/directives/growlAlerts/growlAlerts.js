'use strict';

angular.module('mobiusApp.directives.growlAlerts', [])
  .directive('growlAlerts', ['growl', '$rootScope', '$timeout',
    function(growl, $rootScope, $timeout) {
      return {
        restrict: 'E',
        scope: {
          bookingMessage: '=',
          viewsMessage: '=',
          searchesMessage: '=',
          positionReference: '=',
          displayTime: '=',
          displayDelay: '='
        },
        templateUrl: 'directives/growlAlerts/growlAlerts.html',

        link: function(scope) {
          var config = {
            referenceId: scope.positionReference ? scope.positionReference : 0,
            ttl: scope.displayTime ? scope.displayTime : 10000
          };
          var isHandled = false;

          $rootScope.$on('GROWL_ALERT', function (event, statistic) {
            if(isHandled)
            {
              return;
            }
            else {
              isHandled = true;
              if(scope.displayDelay){
                $timeout(function(){
                  growl.info(formatMessage(statistic), config);
                }, scope.displayDelay);
              }
              else {
                growl.info(formatMessage(statistic), config);
              }
            }
          });

          function formatMessage(statistic){
            var message = '';
            switch(statistic.type) {
              case 'booking':
                message = scope.bookingMessage;
                break;
              case 'view':
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
