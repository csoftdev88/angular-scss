'use strict';

angular.module('mobiusApp.directives.language', [])

.directive('languageList', function($window, $document, Settings, stateService, contentService){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/languageList/languageList.html',

    // Widget logic goes here
    link: function(scope, elem){
      var isOpen = false,
          child = elem.children(),
          close = angular.noop;

      // Handle opening and closing dropdown menu
      elem.bind('click', function(event){
        event.preventDefault();
        event.stopPropagation();

        if (isOpen){
          child.removeClass('open');
          isOpen = false;
        } else {
          child.addClass('open');
          isOpen = true;

          close = function(event){
            if (event){
              event.preventDefault();
              event.stopPropagation();
            }
            child.removeClass('open');
            isOpen = false;
            $document.unbind('click', close);
            close = angular.noop;
          };

          $document.bind('click', close);
        }
      });

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
