'use strict';

angular.module('mobiusApp.directives.aboutHotel', [])

.directive('aboutHotel', function(Settings, contentService, $state){
  return {
    restrict: 'E',
    templateUrl: 'directives/aboutHotel/aboutHotel.html',
    link: function(scope){
      scope.isCollapsed = true;
      scope.benefits = Settings.UI.aboutHotel.benefits;

      contentService.getRandomAdvert(Settings.UI.adverts.randomMainPageAdvertSize).then(
        function(response) {
          scope.randomAdvert = response;
        }
      );

      scope.randomAdvertClick = function () {
        switch(scope.randomAdvert.link.type) {
        case 'news':
          $state.go('news', {
            code: scope.randomAdvert.link.code
          });
          break;
        case 'offer':
          $state.go('offers', {
            code: scope.randomAdvert.link.code
          });
          break;
        default:
          window.open(scope.randomAdvert.link.uri, '_blank');
        }
      };
    }
  };
});
