'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.offers', [])

  .controller('OffersCtrl', function($rootScope, $scope, $controller, $location, contentService,
      $state, $stateParams, _, breadcrumbsService, metaInformationService, bookingService, scrollService, $timeout, chainService, Settings, propertyService) {

    $controller('MainCtrl', {$scope: $scope});

    breadcrumbsService.addBreadCrumb('Offers');

    var NUMBER_OF_RELEVANT_OFFERS = 3;

    var selectedOfferIndex;

    $scope.showDetail = $stateParams.code ? true : false;

    $scope.$watch(function(){
      return $scope.showDetail;
    }, function(){
      if($scope.showDetail) {
        $timeout(function () {
          scrollService.scrollTo('offer-detail', 20);
        });
      }
    });

    contentService.getOffers().then(function(response) {
      $scope.offersList = _.sortBy(response, 'prio').reverse();

      if($stateParams.property){
        $scope.offersList = _.filter($scope.offersList, function(f){
          return _.contains(f.limitToPropertyCodes, $stateParams.property) || !f.limitToPropertyCodes.length;
        });
      }
      
      if ($stateParams.code) {
        selectOffer(bookingService.getCodeFromSlug($stateParams.code));
      }
    });

    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      var chainData = chain;

      chainData.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      chainData.meta.microdata.og['og:title'] = 'Offers: ' + chainData.meta.microdata.og['og:title'];
      chainData.meta.microdata.og['og:description'] = 'Offers: ' + chainData.meta.microdata.og['og:description'];
      metaInformationService.setOgGraph(chainData.meta.microdata.og);
    });

    $scope.getRelevant = function(offer, index) {
      var offset = selectedOfferIndex < NUMBER_OF_RELEVANT_OFFERS ? 1 : 0;
      return selectedOfferIndex !== index && NUMBER_OF_RELEVANT_OFFERS + offset > parseInt(index, 10);
    };

    $scope.goToDetail = function (slug) {
      var code = bookingService.getCodeFromSlug(slug);

      selectedOfferIndex = _.findIndex($scope.offersList, {code: code});
      if (selectedOfferIndex < 0) {
        return $state.go('offers', {code: null});
      }

      $scope.selectedOffer = $scope.offersList[selectedOfferIndex];

      $state.go('offers', {code: slug});
      $timeout(function () {
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
          promoCode: $scope.selectedOffer.promoCode
        });
      });
    };

    $scope.goToOffersList = function() {
      $state.go('offers', {code: ''}, {reload: true});
    };

    function selectOffer(code) {
      selectedOfferIndex = _.findIndex($scope.offersList, {code: code});
      if (selectedOfferIndex < 0) {
        return $state.go('offers', {code: null});
      }
      $scope.selectedOffer = $scope.offersList[selectedOfferIndex];
      metaInformationService.setMetaDescription($scope.selectedOffer.meta.description);
      metaInformationService.setMetaKeywords($scope.selectedOffer.meta.keywords);
      metaInformationService.setPageTitle($scope.selectedOffer.meta.pagetitle);
      $scope.selectedOffer.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      metaInformationService.setOgGraph($scope.selectedOffer.meta.microdata.og);
      breadcrumbsService.clear()
        .addBreadCrumb('Offers', 'offers', {code: null})
        .addBreadCrumb($scope.selectedOffer.title);
    }

    $scope.goToHotels = function(offer) {
      if($stateParams.property){
        propertyService.getPropertyDetails($stateParams.property)
          .then(function(details){
            $state.go('hotel', {propertySlug: details.meta.slug, promoCode: offer.promoCode, scrollTo: 'jsRooms'}, {reload: true});
          });
      }
      else{
        $state.go('hotels', {promoCode: offer.promoCode, scrollTo: 'hotels'});
      }
      
    };

    // Checking if user have selected dates
    var bookingParams = bookingService.getAPIParams();

    if(!bookingParams.from || !bookingParams.to){
      // Dates are not yet selected
      $scope.selectDates = function(){
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
          openDatePicker: true,
          promoCode: $stateParams.code
        });
      };
    }
  });
