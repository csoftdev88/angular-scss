'use strict';

angular.module('mobiusApp.directives.aboutHotel', [])

.directive('aboutHotel', function(Settings, contentService, $state){
  return {
    restrict: 'E',
    templateUrl: 'directives/aboutHotel/aboutHotel.html',
    link: function(scope){
      scope.isCollapsed = true;
      scope.benefits = Settings.UI.aboutHotel.benefits;
      scope.randomAdverts = [];

      var getRandomAdvert = function (index) {
        contentService.getRandomAdvert(Settings.UI.adverts.randomMainPageAdvertSize).then(
          function (response) {
            scope.randomAdverts[index] = response;
          }
        );
      };

      //load first random advert
      getRandomAdvert(0);
      //load offers
      var NUMBER_OF_OFFERS = 2;
      contentService.getOffers({scope: 'homepage'}).then(function(response) {
        scope.offersList = response.splice(0, NUMBER_OF_OFFERS);
        for(var i = 0; i < (NUMBER_OF_OFFERS - scope.offersList.length); i++) {
          //load other adverts if we don't have enough of offers for main page
          getRandomAdvert(i+1);
        }
      });

      scope.advertClick = function (link) {
        switch(link.type) {
        case 'news':
          $state.go('news', {
            code: link.code
          });
          break;
        case 'offer':
          $state.go('offers', {
            code: link.code
          });
          break;
        default:
          window.open(link.uri, '_blank');
        }
      };
    }
  };
});
