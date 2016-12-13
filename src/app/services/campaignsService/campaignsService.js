'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.campaigns', [])
.service('campaignsService',  function($q, Settings, apiService, $rootScope, $stateParams, $state, bookingService, propertyService, routerService, contentService, user, $timeout, modalService, _) {


  function getCampaigns(loggedIn){

    var params = {};
    if($stateParams.dates){
      var dates = $stateParams.dates.split('_');
      params.from = dates[0];
      params.to = dates[1];
    }
    if($stateParams.propertySlug){
      params.property = bookingService.getCodeFromSlug($stateParams.propertySlug);
    }
    params.loggedIn = loggedIn !== null ? loggedIn : user.isLoggedIn();

    return apiService.getThrottled(apiService.getFullURL('campaigns'), params);
  }

  function renderCampaign(data){
    $rootScope.campaign = data ? data : $rootScope.campaign;
    addCampaignUrl();

    //STUB
    $rootScope.campaign.adverts.sideRails.railImage.images.uri = '/static/images/rails.jpg';
    $rootScope.campaign.adverts.pageCurl.images.uri = '/static/images/page-curl-bg.jpg';

    if($rootScope.campaign.adverts.pageCurl) {
      $('body').addClass('campaign-folded-corner-active');
    }

    $timeout(function () {
      // TODO: Check other code types
      $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', $stateParams);
    }, 0);

    if($rootScope.campaign.adverts.interstitial){
      modalService.openCampaignDialog($rootScope.campaign);
    }

    console.log($rootScope.campaign);

  }

  function addCampaignUrl(){
    var offerCode = $rootScope.campaign.association.offerCode;
    var propertyCode = $rootScope.campaign.association.propertyCode;
    var contentCode = $rootScope.campaign.association.contentCode;

    if(offerCode && propertyCode) {
      propertyService.getPropertyDetails(propertyCode).then(function(details) {
        var paramsData = {};
        paramsData.property = details;

        contentService.getOffers().then(function(offers) {
          var selectedOfferIndex = _.findIndex(offers, {
            code: offerCode
          });
          var offer = offers[selectedOfferIndex];
          $stateParams.code = offer.meta.slug;
        });

        routerService.buildStateParams('hotel', paramsData).then(function(params) {
          $stateParams = _.extend($stateParams, params);
          $stateParams.property = null;
          var stateName = Settings.newUrlStructure ? 'propertyHotDeals' : 'propertyOffers';
          $rootScope.campaign.uri = $state.href(stateName, $stateParams, {
            reload: true
          });
        });
      });
    }
    else if(offerCode){
      $rootScope.campaign.uri = $state.href('offers', {code: offerCode});
    }
    else if(propertyCode){
      propertyService.getPropertyDetails(propertyCode).then(function(details) {
        $stateParams.scrollTo = 'jsRooms';
        var paramsData = {};
        paramsData.property = details;
        routerService.buildStateParams('hotel', paramsData).then(function(params) {
          $stateParams = _.extend($stateParams, params);
          $stateParams.property = null;
          $rootScope.campaign.uri = $state.href('hotel', $stateParams, {
            reload: true
          });
        });
      });
    }
    else if(contentCode){
      contentService.getStatic().then(function(response) {
        var staticContent = _.find(response, function(item){
          return item.code === contentCode;
        });
        if(staticContent) {
          var slug = staticContent.meta.slug;
          var codeStartIndex = slug.lastIndexOf('-');
          slug = slug.substring(0, codeStartIndex);
          $rootScope.campaign.uri = $state.href('staticContent', {contentSlug: slug});
        }
      });

    }
  }

  // Public methods
  return {
    getCampaigns: getCampaigns,
    renderCampaign: renderCampaign
  };
});
