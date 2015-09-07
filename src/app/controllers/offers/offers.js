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

    contentService.getOffers().then(function(offers) {
      if($stateParams.property){
        offers = _.filter(offers, function(f){
          return _.contains(f.limitToPropertyCodes, $stateParams.property) || !f.limitToPropertyCodes.length;
        });

        $scope.offersList = _.sortBy(offers, 'prio').reverse();

        if ($stateParams.code) {
          selectOffer(bookingService.getCodeFromSlug($stateParams.code));
        }
      }else{
        // Displaying the offers available on all the properties
        propertyService.getAll().then(function(properties){
          var propertyCodes = _.pluck(properties, 'code');

          $scope.offersList = [];

          _.each(offers, function(offer){
            if(offer.limitToPropertyCodes && offer.limitToPropertyCodes.length === propertyCodes.length){
              $scope.offersList.push(offer);
            }
          });

          $scope.offersList = _.sortBy($scope.offersList, 'prio').reverse();

          if ($stateParams.code) {
            selectOffer(bookingService.getCodeFromSlug($stateParams.code));
          }
        });
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
      bookingParams = bookingService.getAPIParams();

      var stateParams = {};
      stateParams.adults = bookingParams.adults;
      stateParams.children = bookingParams.children;
      stateParams.promoCode = offer.promoCode;
      if (bookingParams.from && bookingParams.to) {
        stateParams.dates = bookingParams.from + ' ' + bookingParams.to;
      }

      if(bookingParams.propertyCode){
        propertyService.getPropertyDetails(bookingParams.propertyCode)
          .then(function(details){
            stateParams.propertySlug = details.meta.slug;
            stateParams.scrollTo = 'jsRooms';
            $state.go('hotel', stateParams, {reload: true});
          });
      }
      else{
        stateParams.scrollTo = 'hotels';
        $state.go('hotels', stateParams);
      }
    };

    // Checking if user have selected dates
    var bookingParams = bookingService.getAPIParams();

    if(!bookingParams.from || !bookingParams.to){
      // Dates are not yet selected
      $scope.selectDates = function(){
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
          openBookingTab: true,
          openDatePicker: true,
          promoCode: $scope.selectedOffer.promoCode || null,
          corpCode: $scope.selectedOffer.corpCode || null,
          groupCode: $scope.selectedOffer.groupCode || null
        });
      };
    }
  });
