'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.questionnaire', [])
    .directive('questionnaire', ['Settings', '$log', 'polls', 'userObject', 'DynamicMessages', 'stateService',
                                 'rewardsService', Questionnaire]);

  function Questionnaire(Settings, $log, pollsService, userObject, DynamicMessages, stateService, rewardsService) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/questionnaire/questionnaire.html',
      link: function (scope) {
        var config = Settings.UI.questionnnaire;
        if (!config) {
          $log.warn('No config for the questionnaire was provided!');
        }

        var appLang = stateService.getAppLanguageCode();
        var dynamicMessages = DynamicMessages[appLang];
        var pollId;

        pollsService.getAll()
          .then(function (data) {
            scope.pollId = data[0].id;
            pollsService.get(data[0].id)
              .then(function (data) {
                scope.question = data.question;
                scope.options = data.choices;
                scope.reward = dynamicMessages.answer_the_question.replace('XX', data.spinsAwarded);
              });
          });

        rewardsService.getMy(userObject.id)
          .then(function (data) {
            console.log('da', data);
          });

        scope.answer = function () {
          if (scope.choiceId) {
            scope.errorMsg = false;
            pollsService.answer(pollId, scope.choiceId)
              .then(function (data) {
                console.log('They answerd', data);
              });
            return;
          }
          scope.errorMsg = dynamicMessages.enter_valid_choice;
        };

        scope.choiceId = 0;
        scope.points = userObject.loyalities.amount;
        scope.tier = userObject.loyalities.tier;
        scope.numStaysToNextTier = 4;
        scope.reward = '';
        scope.question = '';
        scope.options = [];
        scope.title = 'What would you prefer';
        scope.featuredReward = 'Late check out';
        scope.featuredRewardPoints = 200;
      }
    };
  }
}());

