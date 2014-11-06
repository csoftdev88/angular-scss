'use strict';

angular.module('mobiusApp.directives.language', [])

.directive('languageList', function($window, Settings, stateService, contentService){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/languageList/languageList.html',

    // Widget logic goes here
    link: function(scope){

      contentService.getLanguages().then(function(data){
        scope.languages = data.languages||[];
      });

      scope.changeLangage = function(language){
        var location = '';
        if(!language.default){
          location = language.code;
        }

        // TODO: keep other URL params when routes will be defined.
        $window.location.replace('/' + location);
      };

      scope.getShortName = function(languageCode){
        var settings = Settings.UI.languages[languageCode];

        if(!settings){
          throw new Error('Language "' + languageCode + '"is not found in configuration.');
        }

        return settings.shortName;
      };

      scope.getFullName = function(languageCode){
        var settings = Settings.UI.languages[languageCode];

        if (!settings){
          throw new Error('Language "' + languageCode + '"is not found in configuration.');
        }

        return settings.name;
      };

      scope.currentLanguage = stateService.getAppLanguage();
    }
  };
});
