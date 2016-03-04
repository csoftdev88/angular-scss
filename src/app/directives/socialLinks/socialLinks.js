'use strict';

angular.module('mobiusApp.directives.socialLinks', [])

.directive('socialLinks', function(Settings){
  return {
    restrict: 'E',
    templateUrl: 'directives/socialLinks/socialLinks.html',
    // Widget logic goes here
    link: function(scope){
      if(!Settings.UI.displaySocialLinks){
        return;
      }
      scope.socialLinks = Settings.UI.socialLinks;
    }
  };
});