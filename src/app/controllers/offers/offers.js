'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.offers', [])

  .controller('OffersCtrl', function($rootScope, $scope, $controller, $location, contentService,
      $state, $stateParams, _, breadcrumbsService, metaInformationService, bookingService, scrollService, $timeout, chainService, Settings, propertyService, cookieFactory, $window, locationService) {

    $controller('MainCtrl', {$scope: $scope});
    $controller('SSOCtrl', {$scope: $scope});

    $scope.config = Settings.UI.offers;
    $scope.isHotDeals = $state.current.name === 'hotDeals';
    var hasHotDeals = Settings.UI.menu.showHotDeals;
    $scope.selectedOfferAvailabilityData = {};

    breadcrumbsService.clear()
      .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');

    var NUMBER_OF_RELEVANT_OFFERS = 3;
    var DATES_SEPARATOR = '_';

    var selectedOfferIndex;

    $scope.showDetail = $stateParams.code ? true : false;
    $scope.property = null;
    $scope.allOffers = null;

    $scope.$watch(function(){
      return $scope.showDetail;
    }, function(){
      if($scope.showDetail) {
        $timeout(function () {
          scrollService.scrollTo('offer-detail', 20);
        });
      }
    });

    var previousState = {
      state: $state.fromState,
      params: $state.fromParams
    };

    contentService.getOffers().then(function(offers) {

      $scope.allOffers = offers;

      //Remove offers that have expired
      var today = new Date();
      offers = _.reject(offers, function(offer){
        return new Date(offer.expirationDate) < today;
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

          offers = _.filter(offers, function(offer, index){
            var availability = _.find(offer.offerAvailability, function(availability){
              return availability.property === $stateParams.property;
            });
            offers[index].availability = availability && availability.showOnOffersPage ? availability : null;
            return availability && availability.showOnOffersPage;
          });

          $scope.offersList = _.sortBy(offers, 'prio').reverse();

          propertyService.getAll().then(function(properties){
            var property = _.find(properties, function(prop){ return prop.code === $stateParams.property; });
            $scope.property = property;
            $scope.updateHeroContent(_.filter(property.images, {includeInSlider: true}));
            breadcrumbsService.clear()
              .addBreadCrumb('Hotels', 'hotels')
              .addBreadCrumb(property.nameShort, 'hotel', {propertySlug: $stateParams.propertySlug})
              .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers')
              .addAbsHref('About', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsAbout'})
              .addAbsHref('Location', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsLocation'})
              .addAbsHref('Offers', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsOffers'})
              .addAbsHref('Rooms', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsRooms'})
              .addAbsHref('Gallery', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'fnOpenLightBox'});
          });

          if ($stateParams.code) {
            selectOffer(bookingService.getCodeFromSlug($stateParams.code));
          }
          //select current property in dropdown
          if($scope.config.includeOfferAvailabilityPropertyDropdown && $stateParams.propertySlug){
            $scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty = $stateParams.propertySlug;
          }
        }

      }else{

        //show all offers if single property
        if(Settings.UI.generics.singleProperty){
          $scope.offersList = _.sortBy(offers, 'prio').reverse();
          if ($stateParams.code) {
            selectOffer(bookingService.getCodeFromSlug($stateParams.code));
          }
        }
        //Only show offers that have showAtChainLevel true if multiple properties
        else{
          if($scope.isHotDeals){
            //Only show offers with a single property availability
            offers = _.reject(offers, function(offer){
              return !offer.offerAvailability || offer.offerAvailability && offer.offerAvailability.length !== 1;
            });
            //We need the property availability name to display
            propertyService.getAll().then(function(properties){
              offers = _.each(offers, function(offer){
                var property = _.find(properties, function(prop){ return prop.code === offer.offerAvailability[0].property; });
                offer.propertyName = property.nameShort;
                offer.locationCode = property.locationCode;
              });
              //Filter offers by location if any
              if($stateParams.locationSlug){
                locationService.getLocations().then(function(locations){
                  var curLocation = _.find(locations, function(location){ return location.meta.slug === $stateParams.locationSlug; });
                  offers = _.filter(offers, function(offer){ return offer.locationCode === curLocation.code; });
                  $scope.offersList = _.where(offers, {showAtChainLevel: true, showOnOffersPage: true});
                });
              }
              else{
                $scope.offersList = _.where(offers, {showAtChainLevel: true, showOnOffersPage: true});
              }
              if ($stateParams.code) {
                selectOffer(bookingService.getCodeFromSlug($stateParams.code));
              }
              
            });
          }
          else if(!$scope.isHotDeals && hasHotDeals){
            offers = _.reject(offers, function(offer){
              return offer.offerAvailability && offer.offerAvailability.length < 2;
            });
            $scope.offersList = _.where(offers, {showAtChainLevel: true, showOnOffersPage: true});
            if ($stateParams.code) {
              selectOffer(bookingService.getCodeFromSlug($stateParams.code));
            }
          }
        }
      }
    });
  
    //If not a specific offer, load chain data to apply meta data
    if(!$stateParams.code){
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
    }

    $scope.getRelevant = function(offer, index) {
      var offset = selectedOfferIndex < NUMBER_OF_RELEVANT_OFFERS ? 1 : 0;
      return selectedOfferIndex !== index && NUMBER_OF_RELEVANT_OFFERS + offset > parseInt(index, 10);
    };

    $scope.goToDetail = function (slug) {
      var code = bookingService.getCodeFromSlug(slug);

      selectedOfferIndex = _.findIndex($scope.offersList, {code: code});
      if (selectedOfferIndex < 0) {
        return $state.go($scope.isHotDeals ? 'hotDeals' : 'offers', {code: null});
      }

      //Creating property availability dropdown
      $scope.offerAvailabilityProperties = [];
      if($scope.config.includeOfferAvailabilityPropertyDropdown && !$scope.isHotDeals){
        propertyService.getAll().then(function(properties){
          _.each($scope.offersList[selectedOfferIndex].offerAvailability, function(availability){
            var property = _.find(properties, function(property){
              return availability.property === property.code;
            });
            $scope.offerAvailabilityProperties.push({
              'name': property.nameShort,
              'slug': property.meta.slug
            });
          });
        });
      }

      var availability = _.find($scope.offersList[selectedOfferIndex].offerAvailability, function(availability){
        return availability.property === $stateParams.property;
      });

      $scope.offersList[selectedOfferIndex].availability = availability;

      $scope.selectedOffer = $scope.offersList[selectedOfferIndex];
      if($stateParams.propertySlug){
        $state.go('propertyOffers', {code: slug, propertySlug: $stateParams.propertySlug});
      }
      else{
        $state.go($scope.isHotDeals ? 'hotDeals' : 'offers', {code: slug});
      }
      


      $timeout(function () {
        bookingService.setBookingOffer($scope.selectedOffer);
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
          promoCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.promoCode ? $scope.selectedOffer.availability.promoCode : $scope.selectedOffer.promoCode,
          corpCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.corpCode ? $scope.selectedOffer.availability.corpCode : $scope.selectedOffer.corpCode || null,
          groupCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.groupCode ? $scope.selectedOffer.availability.groupCode : $scope.selectedOffer.groupCode || null
        });
      });
    };

    $scope.goToOffersList = function() {
      if(previousState && previousState.state && previousState.state.name !== ''){
        $state.go(previousState.state, previousState.params);
      }
      else{
        $state.go($scope.isHotDeals ? 'hotDeals' : 'offers', {code: ''}, {reload: true});
      }
    };

    function selectOffer(code) {
      
      selectedOfferIndex = _.findIndex($scope.offersList, {code: code});
      if (selectedOfferIndex < 0) {
        return $state.go($scope.isHotDeals ? 'hotDeals' : 'offers', {code: null});
      }

      //Creating property availability dropdown
      $scope.offerAvailabilityProperties = [];
      if($scope.config.includeOfferAvailabilityPropertyDropdown && !$scope.isHotDeals){
        propertyService.getAll().then(function(properties){
          _.each($scope.offersList[selectedOfferIndex].offerAvailability, function(availability){
            var property = _.find(properties, function(property){
              return availability.property === property.code;
            });
            $scope.offerAvailabilityProperties.push({
              'name': property.nameShort,
              'slug': property.meta.slug
            });
          });
        });
      }

      var availability = _.find($scope.offersList[selectedOfferIndex].offerAvailability, function(availability){
        return availability.property === $stateParams.property;
      });

      $scope.offersList[selectedOfferIndex].availability = availability;

      $scope.selectedOffer = $scope.offersList[selectedOfferIndex];
      bookingService.setBookingOffer($scope.selectedOffer);
      $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
        promoCode: $scope.offersList[selectedOfferIndex].availability && $scope.offersList[selectedOfferIndex].availability.promoCode ? $scope.offersList[selectedOfferIndex].availability.promoCode : $scope.offersList[selectedOfferIndex].promoCode,
        corpCode: $scope.offersList[selectedOfferIndex].availability && $scope.offersList[selectedOfferIndex].availability.corpCode ? $scope.offersList[selectedOfferIndex].availability.corpCode : $scope.offersList[selectedOfferIndex].corpCode || null,
        groupCode: $scope.offersList[selectedOfferIndex].availability && $scope.offersList[selectedOfferIndex].availability.groupCode ? $scope.offersList[selectedOfferIndex].availability.groupCode : $scope.offersList[selectedOfferIndex].groupCode || null
      });

      if($scope.selectedOffer.discountCode){
        var cookieValue = cookieFactory('discountCode') && cookieFactory('discountCode').indexOf($scope.selectedOffer.discountCode) === -1? cookieFactory('discountCode') + '|' + $scope.selectedOffer.discountCode : $scope.selectedOffer.discountCode;

        var cookieExpiryDate = null;
        if(Settings.UI.offers.discountCodeCookieExpiryDays && Settings.UI.offers.discountCodeCookieExpiryDays !== 0){
          cookieExpiryDate = new Date();
          cookieExpiryDate.setDate(cookieExpiryDate.getDate() + Settings.UI.offers.discountCodeCookieExpiryDays); 
        }
        $window.document.cookie = 'discountCode=' + cookieValue + (!cookieExpiryDate ? '' : '; expires=' + cookieExpiryDate.toUTCString()) + '; path=/';
      }

      metaInformationService.setMetaDescription(availability && availability.metaDescription && availability.metaDescription !== '' ? availability.metaDescription : $scope.selectedOffer.meta.description);
      metaInformationService.setMetaKeywords(availability && availability.keywords && availability.keywords !== '' ? availability.keywords : $scope.selectedOffer.meta.keywords);
      metaInformationService.setPageTitle(availability && availability.pagetitle && availability.pagetitle !== '' ? availability.pagetitle : $scope.selectedOffer.meta.pagetitle);
      $scope.selectedOffer.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      metaInformationService.setOgGraph($scope.selectedOffer.meta.microdata.og);

      if($stateParams.property){

        propertyService.getAll().then(function(properties){
            var property = _.find(properties, function(prop){ return prop.code === $stateParams.property; });
            $scope.updateHeroContent(_.filter(property.images, {includeInSlider: true}));
            breadcrumbsService.clear()
              .addBreadCrumb('Hotels', 'hotels')
              .addBreadCrumb(property.nameShort, 'hotel', {propertySlug: $stateParams.propertySlug})
              .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers', $scope.isHotDeals ? 'hotDeals' : 'offers', {code: null})
              .addBreadCrumb($scope.selectedOffer.availability && $scope.selectedOffer.availability.title &&  $scope.selectedOffer.availability.title !== '' ?  $scope.selectedOffer.availability.title : $scope.selectedOffer.title)
              .addAbsHref('About', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsAbout'})
              .addAbsHref('Location', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsLocation'})
              .addAbsHref('Offers', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsOffers'})
              .addAbsHref('Rooms', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'jsRooms'})
              .addAbsHref('Gallery', 'hotel', {propertySlug: $stateParams.propertySlug, scrollTo: 'fnOpenLightBox'});
          });
      }
      else{
        breadcrumbsService.clear()
          .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers', $scope.isHotDeals ? 'hotDeals' : 'offers', {code: null})
          .addBreadCrumb($scope.selectedOffer.title);
      }

    }

    $scope.goToHotels = function(offer) {
      bookingParams = bookingService.getAPIParams();

      var stateParams = {};
      stateParams.adults = bookingParams.adults;
      stateParams.children = bookingParams.children;
      stateParams.promoCode = offer.availability && offer.availability.promoCode ? offer.availability.promoCode : offer.promoCode;
      stateParams.groupCode = offer.availability && offer.availability.groupCode ? offer.availability.groupCode : offer.groupCode;
      stateParams.corpCode = offer.availability && offer.availability.corpCode ? offer.availability.corpCode : offer.corpCode;
      if (bookingParams.from && bookingParams.to) {
        stateParams.dates = bookingParams.from + DATES_SEPARATOR + bookingParams.to;
      }

      if(bookingParams.propertyCode && !$scope.config.includeOfferAvailabilityPropertyDropdown || $scope.isHotDeals){
        propertyService.getPropertyDetails($scope.isHotDeals ? offer.offerAvailability[0].property : bookingParams.propertyCode)
          .then(function(details){
            stateParams.propertySlug = details.meta.slug;
            stateParams.scrollTo = 'jsRooms';
            $state.go('hotel', stateParams, {reload: true});
          });
      }
      else if($scope.config.includeOfferAvailabilityPropertyDropdown && $scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty && !$scope.isHotDeals){
        stateParams.propertySlug = $scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty;
        stateParams.property = bookingService.getCodeFromSlug($scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty);
        stateParams.scrollTo = 'jsRooms';
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
          property: stateParams.property
        });
        $state.go('hotel', stateParams, {reload: true});
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
        bookingService.setBookingOffer($scope.selectedOffer);
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
          openBookingTab: true,
          openDatePicker: true,
          promoCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.promoCode ? $scope.selectedOffer.availability.promoCode : $scope.selectedOffer.promoCode || null,
          corpCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.corpCode ? $scope.selectedOffer.availability.corpCode : $scope.selectedOffer.corpCode || null,
          groupCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.groupCode ? $scope.selectedOffer.availability.groupCode : $scope.selectedOffer.groupCode || null
        });
      };
    }

    $scope.bindHtmlClick = function(event){
      if(event.target.attributes['ng-click'] && event.target.attributes['ng-click'].value === 'login()'){
        $scope.sso.login();
      }
    };

  });
