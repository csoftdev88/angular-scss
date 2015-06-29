'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.offers', [])

  .controller('OffersCtrl', function($scope, $controller, contentService,
         $state, $stateParams, _, breadcrumbsService) {

    $controller('MainCtrl', {$scope: $scope});

    breadcrumbsService.addBreadCrumb('Offers');

    var NUMBER_OF_RELEVANT_OFFERS = 3;

    var selectedOfferIndex;

    $scope.showDetail = $stateParams.code ? true : false;

    contentService.getOffers().then(function(response) {
      $scope.offersList = response;
      if ($stateParams.code) {
        selectOffer($stateParams.code);
      }
    });

    $scope.getRelevant = function(offer, index) {
      var offset = selectedOfferIndex < NUMBER_OF_RELEVANT_OFFERS ? 1 : 0;
      return selectedOfferIndex !== index && NUMBER_OF_RELEVANT_OFFERS + offset > parseInt(index, 10);
    };

    $scope.goToDetail = function(code) {
      $state.go('offers', {code: code});
    };

    function selectOffer(code) {
      selectedOfferIndex = _.findIndex($scope.offersList, {code: code});
      if (selectedOfferIndex < 0) {
        return $state.go('offers', {code: null});
      }
      $scope.selectedOffer = $scope.offersList[selectedOfferIndex];
      breadcrumbsService.clear()
        .addBreadCrumb('Offers', 'offers', {code: null})
        .addBreadCrumb($scope.selectedOffer.title);
    }
  });
