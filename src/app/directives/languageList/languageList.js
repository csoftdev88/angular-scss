'use strict';

angular.module('mobiusApp.directives.language', [])

.directive('languageList', function(Settings, contentService){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/languageList/languageList.html',

    // Widget logic goes here
    link: function(scope){
      contentService.getLangages().then(function(data){
        scope.languages = data.languages||[];
      });
    }
  };
});
