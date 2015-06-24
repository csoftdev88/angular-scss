'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.offers', [])

  .controller('OffersCtrl', function($scope, $controller, contentService){

    $controller('MainCtrl', {$scope: $scope});

    //$scope.category = $stateParams.category;
    //$scope.offerID = $stateParams.offerID;

    var NUMBER_OF_RELEVANT_OFFERS = 3;

    var selectedOfferIndex;
    $scope.getRelevant = function(offer, index) {
      var offset = selectedOfferIndex < NUMBER_OF_RELEVANT_OFFERS ? 1 : 0;
      return selectedOfferIndex !== index && NUMBER_OF_RELEVANT_OFFERS + offset > parseInt(index, 10);
    };

    $scope.showOffersList = true;
    contentService.getOffers().then(function(response) {
      $scope.offersList = response;
    });

    $scope.selectOffer = function(index) {
      $scope.selectedOffer = $scope.offersList[index];
      selectedOfferIndex = index;
      $scope.showOffersList = false;
    };

  });
