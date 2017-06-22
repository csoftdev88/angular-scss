'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.questionnaire', [])
    .directive('questionnaire', ['Settings', '$log', 'polls', 'userObject', 'DynamicMessages', 'stateService',
                                 'rewardsService', '$controller', '_', 'reservationService', 'propertyService',
                                 'apiService', '$q', 'user', Questionnaire]);

  function Questionnaire(Settings, $log, pollsService, userObject, DynamicMessages, stateService, rewardsService,
                         $controller, _, reservations, property, apiService, $q, user) {
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
          pollsService.getAll()
            .then(function (data) {
              if (data) {
                pollId = data[0].id;
                pollsService.get(data[0].id)
                  .then(function (data) {
                    scope.question = data.question;
                    scope.options = data.choices;
                    scope.choiceId = data.choices[0].id;
                    scope.reward = dynamicMessages.answer_the_question.replace('XX', data.spinsAwarded);
                  });
                return;
              }
              $log.info('No polls available, maybe the user answered all of them');
              scope.question = false;
            })
            .catch(function(err) {
              if (!scope.nextStay) {
                $log.warn('APi failed to get the next poll, maybe the user answered all of them', err);
                scope.question = false;
              }
            });
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

          reservationPromise.then(function (nextStay) {
            if (nextStay) {
              property.getPropertyDetails(nextStay.property.code)
                .then(function (property) {
                  $log.info('Property retrieved, assigning it to the next stay object');
                  nextStay.property = property;
                  scope.nextStay = nextStay;
                  $log.info('The next stay', nextStay);
                });
            }
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

