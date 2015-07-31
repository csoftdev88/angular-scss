'use strict';

angular.module('mobiusApp.directives.aboutHotel', [])

.directive('aboutHotel', function(Settings, contentService, $state, advertsService, chainService, metaInformationService, $location){
  return {
    restrict: 'E',
    templateUrl: 'directives/aboutHotel/aboutHotel.html',
    link: function(scope){
      scope.isCollapsed = true;
      scope.benefits = Settings.UI.aboutHotel.benefits;
      scope.randomAdverts = [];

      var getRandomAdvert = function (index) {
        contentService.getRandomAdvert({bannerSize: Settings.UI.adverts.randomMainPageAdvertSize}).then(
          function (response) {
            scope.randomAdverts[index] = response;
          }
        );
      };

      chainService.getChain(Settings.API.chainCode).then(function(chain) {
        var chainData = chain;

        chainData.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
        chainData.meta.microdata.og['og:title'] = chainData.meta.microdata.og['og:title'];
        chainData.meta.microdata.og['og:description'] = chainData.meta.microdata.og['og:description'];
        metaInformationService.setOgGraph(chainData.meta.microdata.og);
      });

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

      scope.advertClick = advertsService.advertClick;
    }
  };
});
