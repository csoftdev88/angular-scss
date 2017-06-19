'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.questionnaire', [])
    .directive('questionnaire', ['Settings', '$log', 'polls', 'userObject', 'DynamicMessages', 'stateService',
                                 'rewardsService', '$controller', '_', Questionnaire]);

  function Questionnaire(Settings, $log, pollsService, userObject, DynamicMessages, stateService, rewardsService,
                         $controller, _) {
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
              pollId = data[0].id;
              pollsService.get(data[0].id)
                .then(function (data) {
                  scope.question = data.question;
                  scope.options = data.choices;
                  scope.choiceId = data.choices[0].id;
                  scope.reward = dynamicMessages.answer_the_question.replace('XX', data.spinsAwarded);
                });
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
          if (userObject.loyalties) {
            scope.points = userObject.loyalties.amount;
            scope.tier = userObject.loyalties.tier;
          } else {
            $log.warn('Loyalties should have been loaded but where not. Maybe something funky happening with the auth controller');
          }

          selectPoll();

          // Get rewards available to the user
          rewardsService.getAll(userObject.id)
            .then(function (rewards) {
              $log.info('Rewards have been retrieved.', rewards);
              var highest = rewards[0];
              _.each(rewards, function (reward) {
                if (reward.weighting > highest.weighting) {
                  highest = reward;
                }
              });
              scope.featuredReward = highest.name;
              scope.featuredRewardPoints = highest.pointCost;
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

