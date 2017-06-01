'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.questionnaire', [])
    .directive('localInfo', ['Settings', '$log', Questionnaire]);

  function Questionnaire(Settings, $log) {
    return {
      restrict: 'E',
      scope: {

      },
      templateUrl: 'directives/lbe/questionnaire/questionnaire.html',
      link: function() {
        var config = Settings.UI.questionnnaire;
        if (!config) {
          $log.warn('No config for the questionnaire was provided!');
        }
      }
    };
  }
}());

