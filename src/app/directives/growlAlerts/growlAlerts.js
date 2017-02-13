'use strict';

angular.module('mobiusApp.directives.growlAlerts', [])
  .directive('growlAlerts', ['growl', '$rootScope', '$timeout', '$location', 'Settings',
    function(growl, $rootScope, $timeout, $location, Settings) {
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
          weeks: '=',
          languagesMessage: '=',
          retentionMessage: '='
        },
        templateUrl: 'directives/growlAlerts/growlAlerts.html',

        link: function(scope) {
          var bookingStatsConfig = {
            referenceId: scope.positionReference ? scope.positionReference : 0,
            ttl: scope.displayTime ? scope.displayTime : 10000,
            disableIcons: true
          };

          var languagePromptConfig = {
            referenceId:3,
            ttl: 1000000,
            disableIcons: true
          };

          var retentionPromptConfig = {
            referenceId: 2,
            ttl: scope.displayTime ? scope.displayTime : 10000,
            disableIcons: true
          };

          scope.$on('STATS_GROWL_ALERT', function (event, statistic) {
            if(scope.displayDelay){
              $timeout(function(){
                growl.info(getStatsIcon(statistic) + '<p>' + formatStatsMessage(statistic) + '</p>', bookingStatsConfig);
              }, scope.displayDelay);
            }
            else {
              $timeout(function () {
                growl.info(formatStatsMessage(statistic), bookingStatsConfig);
              });
            }
          });  

          console.log('add growl alert listener');
          $rootScope.$on('RETENTION_GROWL_ALERT', function (event, retentionTelephone) {
            if(retentionTelephone){
              $timeout(function () {
                console.log('show the growl alert');
                growl.info('<i class="fa fa-phone"></i>' + '<p>' + scope.retentionMessage + ' ' + retentionTelephone + '</p>', retentionPromptConfig);
              });
            }
          });

          scope.$on('$destroy', function() {
            console.log('remove growl alert listener');
            $rootScope.$on('RETENTION_GROWL_ALERT', function (){});
          });

          if(Settings.sandmanFrenchOverride) {
            var currentURL = $location.path();
            if(currentURL.indexOf('/locations/quebec') !== -1) {
              scope.$on('LANGUAGE_GROWL_ALERT', function () {
                $timeout(function(){
                  growl.info('<i class="fa fa-check-circle"></i>' + '<p>' + scope.languagesMessage + '</p>', languagePromptConfig);
                });
              });
            }
          }

          function getStatsIcon(statistic){
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

          function getStatsUnit(statistic){
            var unit = '';
            if(statistic.time.period === 1){
              switch(statistic.time.unit) {
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
              switch(statistic.time.unit) {
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

          function formatStatsMessage(statistic){
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

            message = message.replace('{numTypes}', statistic.count).replace('{numUnits}', statistic.time.period).replace('{unit}', getStatsUnit(statistic));

            return message;
          }
        }
      };
    }
  ]);
