'use strict';

angular.module('mobiusApp.directives.language', [])

  .directive('languageList', function($window, Settings, contentService, $rootScope, $state, $stateParams, _) {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'directives/languageList/languageList.html',

      // Widget logic goes here
      link: function(scope) {

        contentService.getLanguages().then(function(data) {
          scope.languages = [];
          _.each(data, function(languageData) {
            if (!Settings.UI.languages[languageData.code]) {
              throw new Error('Language "' + languageData.code + '" not found in configuration', languageData);
            } else {
              scope.languages.push(languageData);
            }
          });
        });

        scope.changeLanguage = function(language) {
          var params = $stateParams;
          params.language = language.code;
          $state.go($state.current.name, params);
        };

        scope.getShortName = function(languageCode) {
          return Settings.UI.languages[languageCode].shortName;
        };

        scope.getFullName = function(languageCode) {
          return Settings.UI.languages[languageCode].name;
        };

        scope.currentLanguage = $rootScope.language_code;
      }
    };
  })
;
