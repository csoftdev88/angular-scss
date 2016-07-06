'use strict';

angular.module('mobiusApp.services.state', [])
  .service('stateService', ['$window', 'Settings', '$rootScope', 'queryService', function($window, Settings, $rootScope, queryService) {

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

    function getCurrentCurrency() {
      var currentCurrency = queryService.getValue(Settings.currencyParamName) || $rootScope.currencyCode || Settings.UI.currencies.default;
      return Settings.UI.currencies[currentCurrency] || null;
    }

    function isMobile(){
      return $window.innerWidth <= Settings.UI.screenTypes.mobile.maxWidth;
    }
    
    // Public methods
    return {
      getStateLayout: getStateLayout,
      getAppLanguageCode: getAppLanguageCode,
      getCurrentCurrency: getCurrentCurrency,
      isMobile: isMobile
    };
  }]);
