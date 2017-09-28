'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 * FIXME: rename this.
 * FIXME: this has been hugely corrupted over-time and does much more than the name questionnaire implies
 * This now does:
 * 1. Loyalty status (points, tier)
 * 2. Poll questions
 * 3. Next stay with addons
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.questionnaire', ['mobiusApp.services.polls'])
    .directive('questionnaire', ['Settings', '$log', 'polls', 'userObject', 'DynamicMessages', 'stateService',
                                 'rewardsService', '$controller', '_', 'reservationService', 'propertyService',
                                 'apiService', '$q', 'user', 'userMessagesService', '$rootScope', 'modalService',
                                 'infinitiEcommerceService', 'preloaderFactory', Questionnaire]);

  function Questionnaire(Settings, $log, pollsService, userObject, DynamicMessages, stateService, rewardsService,
                         $controller, _, reservations, property, apiService, $q, user, userMessagesService, $rootScope,
                         modalService, infinitiEcommerceService, preloaderFactory) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/questionnaire/questionnaire.html',
      link: function (scope) {

        var config;
        var pollId;
        var appLang;
        var dynamicMessages;

        // Get all the polls available then display the first with options in the directive
        var selectPoll = function () {
          return pollsService.getAll()
            .then(function (data) {
              if (data) {
                pollId = data[0].id;
                return pollsService.get(data[0].id)
                  .then(function (data) {
                    scope.question = data.question;
                    scope.options = data.choices;
                    scope.choiceId = data.choices[0].id;
                    scope.reward = dynamicMessages.answer_the_question.replace('XX', data.points);
                  });
              }
              $log.info('No polls available, maybe the user answered all of them');
              scope.question = false;
            })
            .catch(function (err) {
              if (!scope.nextStay) {
                $log.warn('APi failed to get the next poll, maybe the user answered all of them', err);
                scope.question = false;
              }
            });
        };

        function getAvailableAddons() {
          // TODO: refactor this into a new addonsService and reuse it in reservationDetails.js
          return $q.all([
            // Available addons
            reservations.getAvailableAddons(scope.auth, {
              propertyCode: scope.nextStay.property.code,
              roomTypeCode: scope.nextStay.rooms[0].roomTypeCode,
              productCode: scope.nextStay.rooms[0].productCode,
              reservationID: scope.nextStay.id
            }),
            // Reservation addons
            reservations.getReservationAddOns(scope.nextStay.reservationCode, null)
          ]).then(function(addons) {
            // Available addons should only contain those which not in reservationAddons
            var availableAddons = addons[0];
            var reservationAddons = addons[1];

            scope.nextStay.availableAddons = [];
            _.each(availableAddons, function(addon) {

              var addedAddon = _.find(reservationAddons, function(a) {
                return a.code === addon.code;
              });

              if (!addedAddon) {
                scope.nextStay.availableAddons.push(addon);
              }
            });

            var SHORT_DESCRIPTION_LENGTH = 100;
            scope.nextStay.reservationAddons = _.map(reservationAddons, function(addon) {
              addon.descriptionShort = addon.description ? addon.description.substr(0, SHORT_DESCRIPTION_LENGTH) : '';
              addon.hasViewMore = addon.descriptionShort && addon.description && addon.descriptionShort.length < addon.description.length;
              if (addon.hasViewMore) {
                addon.descriptionShort += '…';
              }
              return addon;
            });
          });
        }

        // TODO: refactor this into a new addonsService and reuse it in reservationDetails.js
        scope.addAddon = function (addon) {
          // Check if this addon was already added
          if (scope.nextStay.reservationAddons.indexOf(addon.code) !== -1) {
            return;
          }
          // Add the addon to the next stay
          var addAddonPromise = reservations.addAddon(scope.nextStay.reservationCode, addon, null)
            .then(function () {
              // Infiniti Tracking purchase

              var product = {
                'id': addon.code,
                'variant': 'Room:' + addon.roomTypeCode + '|Type:' + addon.name,
                'quantity': 1,
                'amount': Settings.API.reservations.inclusionsAsAddons && addon.price ? addon.price.totalAfterTax : addon.price,
                'category': 'Add-Ons',
                'currency': $rootScope.currencyCode,
                'title': addon.name,
                'desc': addon.description
              };
              var infinitiTrackingProducts = [product];

              var infinitiTrackingData = {
                'reservationNumber': scope.nextStay.reservationCode,
                'products': infinitiTrackingProducts
              };

              infinitiEcommerceService.trackPurchase(true, infinitiTrackingData);

              // Removing from available addons
              scope.nextStay.availableAddons = _.reject(scope.nextStay.availableAddons, function (a) {
                return a.code === addon.code;
              });
              // Adding to reservation addons

              // FIXME: what does that note/comment mean? In English please?
              // NOTE: When getting addons from the API points will be reflected in another
              // property as in original object `points` instead of `pointsRequired`
              addon.points = addon.pointsRequired;
              scope.nextStay.reservationAddons.push(addon);


              userMessagesService.addMessage(DynamicMessages[appLang].you_have_added + addon.name + DynamicMessages[appLang].to_your_reservation, false, true, 'reservation-confirmation');

              // Updating user loyalties once payment was done using the points
              if (addon.pointsRequired) {
                user.loadLoyalties();
              }
            });

          preloaderFactory(addAddonPromise);
        };

        scope.openAddonDetailDialog = function(e, addon, payWithPoints) {
          console.log('openAddonDetailDialog called', arguments);
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          modalService.openAddonDetailDialog(scope.addAddon, addon, payWithPoints);
        };

        var init = function () {

          // Get the applications language and define array to get localised content from
          appLang = stateService.getAppLanguageCode();
          dynamicMessages = DynamicMessages[appLang];

          // Get the config for the directive
          config = Settings.UI.questionnnaire;
          if (!config) {
            $log.warn('No config for the questionnaire was provided!');
          }

          // Get the user's loyalty info
          var loyaltiesPromise = $q.all([
            user.loadLoyalties(userObject.id),
            user.loadRewards(userObject.id)
          ]).then(function () {
            scope.points = userObject.loyalties.amount;
            scope.tier = userObject.loyalties.tier;
            scope.name = userObject.firstName + ' ' + userObject.lastName;
          });

          loyaltiesPromise.then(function () {
            apiService.get(
              apiService.getFullURL('customers.transactions', { customerId: userObject.id })
            ).then(function(data) {
              var total = 0;
              $log.info('Retrieved customer transactions', data);
              _.each(data.recentTransactions, function (transaction) {
                total += transaction.amount;
              });
              scope.numPointsToNextTier = (Math.ceil(total / 1000) * 1000) - scope.points;
            });
          });

          selectPoll();

          var reservationPromise = reservations.getAll()
            .then(function (reservations) {
              $log.info('Reservations retrieved', reservations);
              var nextStay = reservations[0] || null;
              // Find the reservation with the earliest start date
              _.each(reservations, function (reservation) {
                if (new Date(reservation.arrivalDate) < new Date(nextStay.arrivalDate)) {
                  nextStay = reservation;
                }
              });
              return nextStay;
            });

          reservationPromise
            .then(function (nextStay) {
              if (nextStay) {
                return property.getPropertyDetails(nextStay.property.code)
                  .then(function (property) {
                    $log.info('Property retrieved, assigning it to the next stay object');
                    nextStay.property = property;
                    scope.nextStay = nextStay;
                    return getAvailableAddons();
                  })
                  .then(function () {
                    $log.info('Fetched addons: the next stay', scope.nextStay);
                  });
              }
            })
            .catch(function (error) {
              $log.error('Fetching reservation details failed', error);
            });

          // Get rewards available to the user
          rewardsService.getAll(userObject.id)
            .then(function (rewards) {
              $log.info('Rewards have been retrieved.', rewards);
              var highest = rewards[0] || null;
              _.each(rewards, function (reward) {
                if (reward.weighting > highest.weighting) {
                  highest = reward;
                }
              });
              if (highest) {
                scope.featuredReward = highest.name;
                scope.featuredRewardPoints = highest.pointCost;
              } else {
                scope.noRewardAvailable = true;
              }
            });

          /**
           * Function used to answer the poll
           */
          scope.answer = function () {
            if (scope.choiceId) {
              scope.errorMsg = false;
              pollsService.answer(pollId, scope.choiceId)
                .then(function (data) {
                  $log.info('Poll successfully submitted', data);
                  selectPoll();
                });
              return;
            }
            scope.errorMsg = dynamicMessages.enter_valid_choice;
          };

          // Scoped variable used within the directive
          scope.choiceId = 0;
          scope.numStaysToNextTier = 4;
          scope.reward = '';
          scope.question = '';
          scope.options = [];
          scope.featuredReward = null;
          scope.featuredRewardPoints = null;
          scope.nextStay = false;
          scope.defaultCurrencyCode = Settings.UI.currencies.default;
        };

        /**
         * As the directive's logic relies on the user being logged in and containing their rewards data, pass
         * an init function to the auth controller to add to the auth promise chain.
         */
        $controller('AuthCtrl', {$scope: scope, config: {onAuthorized: init}});

      }
    };
  }
}());

