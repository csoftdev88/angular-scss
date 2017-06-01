'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.questionnaire', [])
    .directive('questionnaire', ['Settings', '$log', Questionnaire]);

  function Questionnaire(Settings, $log) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/questionnaire/questionnaire.html',
      link: function (scope) {
        var config = Settings.UI.questionnnaire;
        if (!config) {
          $log.warn('No config for the questionnaire was provided!');
        }
        scope.points = 50;
        scope.tier = 'bronze';
        scope.numStaysToNextTier = 4;
        scope.reward = '10 points';
        scope.question = 'What would you be most delighted to have in your room upon arrival?';
        scope.options = [
          {
            name: 'Flowers'
          },
          {
            name: 'Wine'
          },
          {
            name: 'Fruit basket'
          }
        ];
      }
    };
  }
}());

