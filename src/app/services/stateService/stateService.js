'use strict';

angular.module('mobiusApp.services.state', [])
  .service('stateService', ['Settings', '$location', function(Settings) {

    function getStateLayout(stateName) {
      var config = Settings.UI.layout[stateName];
      if (!config) {
        return [];
      }

      // List of html templates
      var layout = [];

      for (var i = 0; i < config.length; i++) {
        var areaName = config[i];
        // Check whether area name has template
        var template = Settings.UI.templates[areaName];

        if (template) {
          layout.push(template);
        }
      }

      return layout;
    }

    // Getting language from corresponding meta tag
    function getAppLanguageCode() {
      var meta = $('meta[http-equiv=Content-Language]');
      return meta.attr('content');
    }

    // Public methods
    return {
      getStateLayout: getStateLayout,
      getAppLanguageCode: getAppLanguageCode,
    };
  }]);
