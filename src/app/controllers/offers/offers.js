'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.offers', [])

  .controller('OffersCtrl', function($scope, $controller, contentService, $stateParams, _){

    $controller('MainCtrl', {$scope: $scope});

    var NUMBER_OF_RELEVANT_OFFERS = 3;

    var selectedOfferIndex;

    $scope.showDetail = $stateParams.$stateParams.showDetail;

    contentService.getOffers().then(function(response) {
      $scope.offersList = response;
      selectedOfferIndex =  _.findIndex($scope.offersList, function(item) {
        return item.code === $stateParams.$stateParams.code;
      });
    });

    $scope.getRelevant = function(offer, index) {
      var offset = selectedOfferIndex < NUMBER_OF_RELEVANT_OFFERS ? 1 : 0;
      return selectedOfferIndex !== index && NUMBER_OF_RELEVANT_OFFERS + offset > parseInt(index, 10);
    };

    $scope.selectOffer = function(index) {
      $scope.selectedOffer = $scope.offersList[index];
      selectedOfferIndex = index;
      $scope.showDetail = true;
    };

  });
