'use strict';
angular.module('mobiusApp.services.state', []).service('stateService', [
  'Settings',
  function (Settings) {
    function getStateLayout(stateName) {
      var config = Settings.layout[stateName];
      if (!config) {
        return [];
      }
      // List of html templates
      var layout = [];
      for (var i = 0; i < config.length; i++) {
        var areaName = config[i];
        // Check whether area name has template
        var template = Settings.templates[areaName];
        if (template) {
          layout.push(template);
        }
      }
      return layout;
    }
    // Public methods
    return { getStateLayout: getStateLayout };
  }
]);