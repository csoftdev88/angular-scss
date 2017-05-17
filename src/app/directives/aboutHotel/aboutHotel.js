'use strict';

angular.module('mobiusApp.directives.aboutHotel', [])

.directive('aboutHotel', function(Settings, contentService, $state, advertsService, chainService, metaInformationService, $location, _){
  return {
    restrict: 'E',
    templateUrl: 'directives/aboutHotel/aboutHotel.html',
    link: function(scope){
      scope.isCollapsed = true;
      scope.showBenefits = Settings.UI.aboutHotel.showBenefits;
      scope.randomAdverts = [];

      scope.offerWidth = Settings.UI.offers.width ? Settings.UI.offers.width : false;
      scope.offerHeight = Settings.UI.offers.height ? Settings.UI.offers.height : false;

      var getRandomAdvert = function (index) {
        contentService.getRandomAdvert({bannerSize: Settings.UI.adverts.randomMainPageAdvertSize}).then(
          function (response) {
            scope.randomAdverts[index] = response;
            scope.randomAdverts = _.uniq(scope.randomAdverts, 'code');
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
        response = _.reject(response, function(item){
          return item.showAtChainLevel === true && item.showOnHomePage === false || !item.showAtChainLevel;
        });
        scope.offersList = response.splice(0, NUMBER_OF_OFFERS);
        for(var i = 0; i < (NUMBER_OF_OFFERS - scope.offersList.length); i++) {
          //load other adverts if we don't have enough of offers for main page
          getRandomAdvert(i+1);
        }
      });

      scope.advertClick = function($event, link) {
        $event.preventDefault();
        advertsService.advertClick(link);
      };
    }
  };
});
