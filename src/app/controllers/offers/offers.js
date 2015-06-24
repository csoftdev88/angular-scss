'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.offers', [])

  .controller('OffersCtrl', function($scope, $controller, contentService,
    $stateParams, _, breadcrumbsService) {

    $controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Offers');

    var NUMBER_OF_RELEVANT_OFFERS = 3;

    var selectedOfferIndex;

    $scope.showDetail = $stateParams.code ? true : false;

    contentService.getOffers().then(function(response) {
      $scope.offersList = response;
      if($stateParams.code) {
        $scope.selectOffer($stateParams.code);
      }
    });

    $scope.getRelevant = function(offer, index) {
      var offset = selectedOfferIndex < NUMBER_OF_RELEVANT_OFFERS ? 1 : 0;
      return selectedOfferIndex !== index && NUMBER_OF_RELEVANT_OFFERS + offset > parseInt(index, 10);
    };

    $scope.selectOffer = function (code) {
      selectedOfferIndex = _.findIndex($scope.offersList,
        function (item) {
          return item.code === code;
        });
      $scope.selectedOffer = $scope.offersList[selectedOfferIndex];
      $scope.showDetail = true;
      breadcrumbsService.clear()
        .addBreadCrumb('Offers', 'offers')
        .addBreadCrumb($scope.selectedOffer.title);
    };
  });
