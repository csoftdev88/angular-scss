'use strict';

angular.module('mobiusApp.directives.growlAlerts', [])
  .directive('growlAlerts', ['_', 'growl', '$rootScope', '$timeout', '$location', 'modalService', 'Settings', 'dataLayerService', 'stateService', 'DynamicMessages',
    function(_, growl, $rootScope, $timeout, $location, modalService, Settings, dataLayerService, stateService, DynamicMessages) {

      // NOTE: As we navigate pages, the new growAlerts controller runs before the old one is destroyed
      // This means we need to proactively remove event handlers from the previous controller
      // instead of relying on angular tidying up for us
      var removeCodeAddedListener = function () {};
      var removeRetentionGrowlListener = function () {};
      var removeStatsGrowlListener = function () {};
      var removeAlternateProductListener = function () {};
      var removeLanguageGrowlListener = function () {};
      var removeRoomUpgradeListener = function () {};

      return {
        restrict: 'E',
        scope: {
          bookingMessage: '=',
          viewsMessage: '=',
          searchesMessage: '=',
          positionReference: '=',
          displayTime: '=',
          displayDelay: '=',
          minute: '=',
          minutes: '=',
          hour: '=',
          hours: '=',
          day: '=',
          days: '=',
          week: '=',
          weeks: '=',
          languagesMessage: '=',
          retentionMessage: '=',
          altProductsMessage: '=',
          roomUpgradeSuccess: '=',
          roomUpgradeFailure: '=',
          roomUpgradeIncrease: '=',
          roomUpgradeDecrease: '='
        },
        templateUrl: 'directives/growlAlerts/growlAlerts.html',

        controller: function($scope) {

          var bookingStatsConfig = {
            referenceId: $scope.positionReference ? $scope.positionReference : 0,
            ttl: $scope.displayTime ? $scope.displayTime : 10000,
            disableIcons: true
          };

          var languagePromptConfig = {
            referenceId:3,
            ttl: 1000000,
            disableIcons: true
          };

          var retentionPromptConfig = {
            referenceId: 2,
            disableIcons: true
          };

          var altProductsPromptConfig = {
            referenceId: 2,
            disableIcons: true
          };

          var roomUpgradePromptConfig = {
            referenceId: 2,
            disableIcons: true
          };

          var bookingCodeAddedPromptConfig = {
            referenceId: 2,
            ttl: 5000,
            disableIcons: true
          };

          //Get our dynamic translations
          var appLang = stateService.getAppLanguageCode();
          var dynamicMessages = appLang && DynamicMessages && DynamicMessages[appLang] ? DynamicMessages[appLang] : null;

          //add statistics growl alert listener
          removeStatsGrowlListener();
          removeStatsGrowlListener = $scope.$on('STATS_GROWL_ALERT', function (event, statistic) {
            if($scope.displayDelay){
              $timeout(function(){
                growl.info(getStatsIcon(statistic) + '<p>' + formatStatsMessage(statistic) + '</p>', bookingStatsConfig);
              }, $scope.displayDelay);
            }
            else {
              $timeout(function () {
                growl.info(formatStatsMessage(statistic), bookingStatsConfig);
              });
            }
          });

          $rootScope.retentionAlertFired = false;



          //add retention growl alert listener
          removeRetentionGrowlListener();
          removeRetentionGrowlListener = $scope.$on('RETENTION_GROWL_ALERT_BROADCAST', function (event, retentionMessage) {
            if(!$rootScope.retentionAlertFired) {
              $rootScope.retentionAlertFired = true;
              if(retentionMessage && retentionMessage.telephone){
                $timeout(function () {
                  $scope.retentionMessage = $scope.retentionMessage.split('(singlequote)').join('&#39;'); //This is the only way to pass through apostrophe's
                  growl.info('<i class="fa fa-phone"></i>' + '<p>' + $scope.retentionMessage + ' ' + retentionMessage.telephone + '</p>', retentionPromptConfig);
                });
              }
            }
          });

          //add alt products growl alert listener
          removeAlternateProductListener();
          removeAlternateProductListener = $scope.$on('ALTERNATIVE_PRODUCT_ALERT_BROADCAST',
            function (event, room, product, products) {
              if (product) {
                $timeout(function () {
                  altProductsPromptConfig.variables = {};
                  altProductsPromptConfig.variables.room = room;
                  altProductsPromptConfig.variables.product = product;
                  altProductsPromptConfig.variables.products = products;
                  growl.info('<i class="fa fa-check-circle"></i><p>' + $scope.altProductsMessage + '</p>', altProductsPromptConfig);

                  //Track the display of alt products notifcation in dataLayer
                  dataLayerService.trackAltDisplayNotification('Rates');
                });
              }
            });

          //It's not ideal using rootScope for this but it avoids making changes to the bower angular-growl directive as it has an isolated scope
          //Also means this is more likely to be futureproof if angular-growl bower is updated
          $rootScope.showAltProduct = function(data){
            modalService.openAltProductDialog(data.room, data.product, data.products);
          };

          //If french override enabled and we are on a quebec page add our language growl alert listener
          removeLanguageGrowlListener();
          removeLanguageGrowlListener = function () {};
          if(Settings.sandmanFrenchOverride) {
            var currentURL = $location.path();
            if(currentURL.indexOf('/locations/quebec') !== -1) {
              removeLanguageGrowlListener = $scope.$on('LANGUAGE_GROWL_ALERT', function () {
                $timeout(function(){
                  growl.info('<i class="fa fa-check-circle"></i>' + '<p>' + $scope.languagesMessage + '</p>', languagePromptConfig);
                });
              });
            }
          }

          removeRoomUpgradeListener();
          removeRoomUpgradeListener = $scope.$on('ROOM_UPGRADE_GROWL_ALERT', function (event, type) {
            var upgradeMessage = '';
            var icon = 'fa-check-circle';

            //Retrieve our upgrade message based on the notification type
            switch(type) {
              case 'success':
                upgradeMessage = $scope.roomUpgradeSuccess;
                break;
              case 'failure':
                icon = 'fa-exclamation-circle';
                upgradeMessage = $scope.roomUpgradeFailure;
                break;
              case 'increase':
                upgradeMessage = $scope.roomUpgradeIncrease;
                break;
              case 'decrease':
                upgradeMessage = $scope.roomUpgradeDecrease;
                break;
              default:
                upgradeMessage = '';
            }

            upgradeMessage = upgradeMessage.split('(singlequote)').join('&#39;'); //This is the only way to pass through apostrophe's to growl
            $timeout(function () {
              growl.info('<i class="fa ' + icon + '"></i><p>' + upgradeMessage + '</p>', roomUpgradePromptConfig);
            });
          });

          //Growl alert for when promo / corp / group codes are added
          var onCodeAdded = function (event, type) {
            var message = '';
            if(dynamicMessages){
              if(type === 'groupCode'){
                message = dynamicMessages.group_code_applied;
              }
              else if(type === 'corpCode'){
                message = dynamicMessages.corp_code_applied;
              }
              else {
                message = dynamicMessages.promo_code_applied;
              }
              $timeout(function () {
                growl.success('<i class="fa fa-check"></i><p>' + message + '</p>', bookingCodeAddedPromptConfig);
              });
            }
          };

          removeCodeAddedListener();

          // Debounce this as there are many code paths emitting the CODE_ADDED_GROWL_ALERT_BROADCAST
          // event in a rapid succession
          var onCodeAddedDebounced = _.debounce(onCodeAdded, 150);
          removeCodeAddedListener = $scope.$on('CODE_ADDED_GROWL_ALERT_BROADCAST', onCodeAddedDebounced);

          function getStatsIcon(statistic) {
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

          function getStatsUnit(statistic) {
            var unit = '';
            if(statistic.time.period === 1){
              switch(statistic.time.unit) {
                case 'minutes':
                  unit = $scope.minute;
                  break;
                case 'hours':
                  unit = $scope.hour;
                  break;
                case 'days':
                  unit = $scope.day;
                  break;
                case 'weeks':
                  unit = $scope.week;
                  break;
                default:
                  unit = '';
              }
            }
            else{
              switch(statistic.time.unit) {
                case 'minutes':
                  unit = $scope.minutes;
                  break;
                case 'hours':
                  unit = $scope.hours;
                  break;
                case 'days':
                  unit = $scope.days;
                  break;
                case 'weeks':
                  unit = $scope.weeks;
                  break;
                default:
                  unit = '';
              }
            }
            return unit;
          }

          function formatStatsMessage(statistic) {
            var message = '';
            switch(statistic.type) {
              case 'booking':
                message = $scope.bookingMessage;
                break;
              case 'view':
                message = $scope.viewsMessage;
                break;
              case 'search':
                message = $scope.searchesMessage;
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
