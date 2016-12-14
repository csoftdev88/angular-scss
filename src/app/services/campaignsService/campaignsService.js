'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.campaigns', [])
.service('campaignsService',  function($q, Settings, apiService, $rootScope, $stateParams, $state, bookingService, propertyService, routerService, contentService, user, $timeout, modalService, $window, cookieFactory, _) {

  function setCampaigns(loggedIn){
    getCampaigns(loggedIn, false).then(function(data){
      if(data.criteria){
        validateCampaign(data, loggedIn);
      }
      else {
        console.log('no campaign returned');
      }
    });
  }

  function getCampaigns(loggedIn, getAll){
    var params = {};

    if(!getAll) {
      if($stateParams.dates){
        var dates = $stateParams.dates.split('_');
        params.from = dates[0];
        params.to = dates[1];
      }
      if($stateParams.propertySlug){
        params.property = bookingService.getCodeFromSlug($stateParams.propertySlug);
      }
      params.loggedIn = loggedIn !== null ? loggedIn : user.isLoggedIn();
    }

    return apiService.getThrottled(apiService.getFullURL('campaigns'), params);
  }

  function validateCampaign(campaign, loggedIn){
    var activeCampaign = cookieFactory('ActiveCampaign');
    var savedCampaign = activeCampaign !== null ? angular.fromJson(activeCampaign) : null;

    if(savedCampaign)
    {
      //Always show previous campaign unless the old is not priority and the new one is
      if(!savedCampaign.priority && campaign.criteria.bookingsUntil && campaign.criteria.bookingsFrom)
      {
        console.log('display new campaign not previous');
        criteriaCheck(campaign, loggedIn);
      }
      else
      {
        getCampaigns(null, true).then(function(data){
          var retrievedCampaign =  _.find(data, function(thisCampaign){
            return thisCampaign.code === savedCampaign.code;
          });
          //If the saved campaign matches a current campaign
          if(retrievedCampaign){
            //Retrieve a priority campaign
            console.log('retain previous campaign do not display new');
            renderCampaign(campaign);
          }
          else {
            //Render the request campaign
            console.log('previous campaign not found, display new');
            criteriaCheck(campaign, loggedIn);
          }
        });
      }
    }
    else {
      console.log('no previous campaign stored, display new campaign');
      criteriaCheck(campaign, loggedIn);
    }
  }

  function criteriaCheck(campaign, loggedIn){
    var criteriaPass = checkActiveDates(campaign);
    if(criteriaPass){
      console.log('active dates ok');
      criteriaPass = checkMemberOnly(campaign, loggedIn);
    }
    if(criteriaPass) {
      console.log('member ok');
      criteriaPass = checkDateRestrictions(campaign);
    }
    if(criteriaPass){
      console.log('bookign date restrictions ok');
      criteriaPass = checkPropertyRestrictions(campaign);
    }
    if(criteriaPass){
      console.log('property restrictions ok');
      renderCampaign(campaign);
    }
  }

  function checkPropertyRestrictions(campaign){
    if(campaign.criteria.properties)
    {
      if($stateParams.property)
      {
        var propertyMatch = _.find(campaign.criteria.properties, function(property){
          return property === $stateParams.property;
        });
        if(propertyMatch){
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }

  function checkDateRestrictions(campaign){
    if(campaign.criteria.bookingsFrom || campaign.criteria.bookingsUntil)
    {
      if($stateParams.dates)
      {
        var bookedDate = $stateParams.dates.split('_');
        if (bookedDate && bookedDate.length) {
          var bookingFromDate = parseInt($window.moment.tz(bookedDate[0], Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
          var bookingToDate = parseInt($window.moment.tz(bookedDate[1], Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
          var criteriaFromDate = parseInt($window.moment.tz($window.moment(campaign.criteria.bookingsFrom).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
          var criteriaToDate = parseInt($window.moment.tz($window.moment(campaign.criteria.bookingsUntil).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
          if(bookingFromDate >= criteriaFromDate && bookingToDate <= criteriaToDate)
          {
            return true;
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }

  function checkMemberOnly(campaign, loggedIn){
    if(campaign.criteria.memberOnly === loggedIn)
    {
      return true;
    }
    else {
      return false;
    }
  }

  function checkActiveDates(campaign){
    var today = parseInt($window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
    var fromDate = parseInt($window.moment.tz($window.moment(campaign.active.from).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
    var toDate = parseInt($window.moment.tz($window.moment(campaign.active.to).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());

    if(fromDate || toDate){
      if(fromDate <= today && toDate >= today)
      {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }

  function renderCampaign(campaign){

    $rootScope.campaign = campaign ? campaign : $rootScope.campaign;

    var activeCampaign = cookieFactory('ActiveCampaign');
    var savedCampaign = activeCampaign !== null ? angular.fromJson(activeCampaign) : null;

    if(savedCampaign){
      if(savedCampaign.code !== campaign.code){
        addCampaignCookie($rootScope.campaign);
      }
    }
    else {
      addCampaignCookie($rootScope.campaign);
    }

    addCampaignUrl();

    if(!$rootScope.campaign.sideRails && $rootScope.campaign.pageCurl) {
      $('body').addClass('campaign-folded-corner-active');
    }

    $timeout(function () {
      // TODO: Check other code types
      $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', $stateParams);
    }, 0);

    if($rootScope.campaign.interstitialAdvert){
      if(savedCampaign) {
        if(!savedCampaign.interstitialDismissed) {
          modalService.openCampaignDialog($rootScope.campaign);
        }
      }
      else {
        modalService.openCampaignDialog($rootScope.campaign);
      }
    }
  }

  function addCampaignUrl(){
    if($rootScope.campaign.association){
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
  }

  function addCampaignCookie(campaign){
    var isPriority = campaign.criteria.bookingsFrom || campaign.criteria.bookingsUntil ? true : false;
    var campaignCookie = {
      'id':campaign.id,
      'code':campaign.code,
      'interstitialDismissed':false,
      'priority': isPriority
    };
    $window.document.cookie = 'ActiveCampaign' + '=' + angular.toJson(campaignCookie) + '; path=/';
  }

  // Public methods
  return {
    setCampaigns: setCampaigns,
    validateCampaign: validateCampaign
  };
});