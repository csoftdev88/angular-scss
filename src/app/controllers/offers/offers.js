'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.offers', [])

  .controller('OffersCtrl', function($rootScope, $scope, $controller, $location, contentService,
      $state, $stateParams, _, breadcrumbsService, metaInformationService, bookingService, scrollService, $timeout, chainService, Settings, propertyService, cookieFactory, $window) {

    $controller('MainCtrl', {$scope: $scope});

    breadcrumbsService.addBreadCrumb('Offers');

    var NUMBER_OF_RELEVANT_OFFERS = 3;

    var selectedOfferIndex;

    $scope.showDetail = $stateParams.code ? true : false;
    $scope.property = {};

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

      //Remove offers that have expired or that have showOnOffersPage set to false
      var today = new Date();
      offers = _.reject(offers, function(offer){
        return new Date(offer.expirationDate) < today || offer.showOnOffersPage === false;
      });

      if($stateParams.property){

        if($state.current.name !== 'propertyOffers'){
          propertyService.getAll().then(function(properties){
            var property = _.find(properties, function(prop){ return prop.code === $stateParams.property; });
            $scope.property = property;
            $state.go('propertyOffers', {propertySlug: property.meta.slug, code: $stateParams.code});
          });
        }
        else{
          offers = _.filter(offers, function(f){
            return _.contains(f.limitToPropertyCodes, $stateParams.property) || !f.limitToPropertyCodes.length;
          });

          $scope.offersList = _.sortBy(offers, 'prio').reverse();

          propertyService.getAll().then(function(properties){
            var property = _.find(properties, function(prop){ return prop.code === $stateParams.property; });
            $scope.property = property;
            $scope.updateHeroContent(_.filter(property.images, {includeInSlider: true}));
            breadcrumbsService.clear()
              .addBreadCrumb('Hotels', 'hotels')
              .addBreadCrumb(property.nameShort, 'hotel', {propertySlug: $stateParams.propertySlug})
              .addBreadCrumb('Offers')
              .addAbsHref('About', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsAbout'})
              .addAbsHref('Location', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsLocation'})
              .addAbsHref('Offers', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsOffers'})
              .addAbsHref('Rooms', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsRooms'})
              .addAbsHref('Gallery', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'fnOpenLightBox'});
          });

          if ($stateParams.code) {
            selectOffer(bookingService.getCodeFromSlug($stateParams.code));
          }
        }



      }else{

        if(Settings.UI.generics.singleProperty){
          $scope.offersList = _.sortBy(offers, 'prio').reverse();
          if ($stateParams.code) {
            selectOffer(bookingService.getCodeFromSlug($stateParams.code));
          }
          return;
        }

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
      metaInformationService.setPageTitle(chain.meta.pagetitle);
      metaInformationService.setMetaDescription(chain.meta.description);
      metaInformationService.setMetaKeywords(chain.meta.keywords);
      
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

      if($scope.selectedOffer.discountCode){
        var cookieValue = cookieFactory('discountCode') && cookieFactory('discountCode').indexOf($scope.selectedOffer.discountCode) === -1? cookieFactory('discountCode') + '|' + $scope.selectedOffer.discountCode : $scope.selectedOffer.discountCode;
        $window.document.cookie = 'discountCode=' + cookieValue;
      }

      metaInformationService.setMetaDescription($scope.selectedOffer.meta.description);
      metaInformationService.setMetaKeywords($scope.selectedOffer.meta.keywords);
      metaInformationService.setPageTitle($scope.selectedOffer.meta.pagetitle);
      $scope.selectedOffer.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      metaInformationService.setOgGraph($scope.selectedOffer.meta.microdata.og);

      if($stateParams.property){

        propertyService.getAll().then(function(properties){
            var property = _.find(properties, function(prop){ return prop.code === $stateParams.property; });
            $scope.updateHeroContent(_.filter(property.images, {includeInSlider: true}));
            breadcrumbsService.clear()
              .addBreadCrumb('Hotels', 'hotels')
              .addBreadCrumb(property.nameShort, 'hotel', {propertySlug: $stateParams.propertySlug})
              .addBreadCrumb('Offers', 'offers', {code: null})
              .addBreadCrumb($scope.selectedOffer.title)
              .addAbsHref('About', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsAbout'})
              .addAbsHref('Location', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsLocation'})
              .addAbsHref('Offers', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsOffers'})
              .addAbsHref('Rooms', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsRooms'})
              .addAbsHref('Gallery', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'fnOpenLightBox'});
          });
      }
      else{
        breadcrumbsService.clear()
          .addBreadCrumb('Offers', 'offers', {code: null})
          .addBreadCrumb($scope.selectedOffer.title);
      }

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
