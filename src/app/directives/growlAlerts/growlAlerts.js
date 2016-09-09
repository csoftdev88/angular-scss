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
          displayDelay: '=',
          hour: '=',
          hours: '=',
          day: '=',
          days: '=',
          week: '=',
          weeks: '='
        },
        templateUrl: 'directives/growlAlerts/growlAlerts.html',

        link: function(scope) {
          var config = {
            referenceId: scope.positionReference ? scope.positionReference : 0,
            ttl: scope.displayTime ? scope.displayTime : 10000,
            disableIcons: true
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
                  growl.info(getIcon(statistic) + '<p>' + formatMessage(statistic) + '</p>', config);
                }, scope.displayDelay);
              }
              else {
                growl.info(formatMessage(statistic), config);
              }
            }
          });

          console.log(scope);

          function getIcon(statistic){
            var iconHtml = '';
            switch(statistic.type) {
              case 'booking':
                iconHtml = '<i class="fa fa-check-circle"></i>';
                break;
              case 'search':
                iconHtml = '<i class="fa fa-search"></i>';
                break;
              default:
                iconHtml = '<i class="fa fa-eye"></i>';
            }
            return iconHtml;
          }

          function getUnit(statistic){
            var unit = '';
            if(statistic.numTypes === 1){
              switch(statistic.unit) {
                case 'hours':
                  unit = scope.hour;
                  break;
                case 'days':
                  unit = scope.day;
                  break;
                case 'weeks':
                  unit = scope.week;
                  break;
                default:
                  unit = '';
              }
            }
            else{
              switch(statistic.unit) {
                case 'hours':
                  unit = scope.hours;
                  break;
                case 'days':
                  unit = scope.days;
                  break;
                case 'weeks':
                  unit = scope.weeks;
                  break;
                default:
                  unit = '';
              }
            }
            return unit;
          }

          function formatMessage(statistic){
            var message = '';
            switch(statistic.type) {
              case 'booking':
                message = scope.bookingMessage;
                break;
              case 'view':
                message = scope.viewsMessage;
                break;
              case 'search':
                message = scope.searchesMessage;
                break;
              default:
                message = 'No message';
            }

            message = message.replace('{numTypes}', statistic.numTypes).replace('{numUnits}', statistic.numUnits).replace('{unit}', getUnit(statistic));

            return message;
          }
        }
      };
    }
  ]);
