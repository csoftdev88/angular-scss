'use strict';

angular.module('mobiusApp.directives.language', [])

.directive('languageList', function($window, contentService){
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
    }
  };
});
