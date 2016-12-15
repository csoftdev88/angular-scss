'use strict';
/*
 * This service sets applicable adverts and campaign visuals
 */
angular.module('mobiusApp.services.campaigns', [])
  .service('campaignsService', function($q, Settings, apiService, $rootScope, $stateParams, $state, bookingService, propertyService, routerService, contentService, user, $timeout, modalService, $window, cookieFactory, _) {
    var activeCampaign = cookieFactory('ActiveCampaign');
    var savedCampaign = activeCampaign !== null ? angular.fromJson(activeCampaign) : null;

    function setCampaigns(loggedIn) {
      getCampaigns(loggedIn, false).then(function(data) {
        if (data.criteria) {
          validateCampaign(data, loggedIn);
        } else {
          console.log('no campaign returned');
        }
      });
    }

    function getCampaigns(loggedIn, getAll) {
      var params = {};

      if (!getAll) {
        if ($stateParams.dates) {
          var dates = $stateParams.dates.split('_');
          params.from = dates[0];
          params.to = dates[1];
        }
        if ($stateParams.propertySlug) {
          params.property = bookingService.getCodeFromSlug($stateParams.propertySlug);
        }
        params.loggedIn = loggedIn !== null ? loggedIn : user.isLoggedIn();
      }

      return apiService.getThrottled(apiService.getFullURL('campaigns'), params);
    }

    function validateCampaign(campaign, loggedIn) {
      if (savedCampaign) {
        //Always show previous campaign unless the old is not priority and the new one is
        if (!savedCampaign.priority && campaign.criteria.bookingsUntil && campaign.criteria.bookingsFrom) {
          console.log('display new campaign not previous');
          criteriaCheck(campaign, loggedIn);
        } else {
          getCampaigns(null, true).then(function(data) {
            var retrievedCampaign = _.find(data, function(thisCampaign) {
              return thisCampaign.code === savedCampaign.code;
            });
            //If the saved campaign matches a current campaign
            if (retrievedCampaign) {
              console.log('retain previous campaign do not display new');
              renderCampaign(retrievedCampaign);
            } else {
              //Render the request campaign
              console.log('previous campaign not found, display new');
              criteriaCheck(campaign, loggedIn);
            }
          });
        }
      } else {
        console.log('no previous campaign stored, display new campaign');
        criteriaCheck(campaign, loggedIn);
      }
    }

    function criteriaCheck(campaign, loggedIn) {
      var criteriaPass = checkActiveDates(campaign);
      if (criteriaPass) {
        console.log('active dates check pass');
        criteriaPass = checkMemberOnly(campaign, loggedIn);
      } else {
        console.log('active dates check fail');
      }
      if (criteriaPass) {
        console.log('member only check pass');
        criteriaPass = checkDateRestrictions(campaign);
      } else {
        console.log('member only check fail');
      }
      if (criteriaPass) {
        console.log('booking date restrictions pass');
        criteriaPass = checkPropertyRestrictions(campaign);
      } else {
        console.log('booking date restrictions fail');
      }
      if (criteriaPass) {
        console.log('property restrictions check pass');
        renderCampaign(campaign);
      } else {
        console.log('property restrictions check fail');
      }
    }

    function checkPropertyRestrictions(campaign) {
      if (campaign.criteria.properties) {
        if ($stateParams.property) {
          var criteriaProperties = campaign.criteria.properties;
          var criteriaPropertiesArray = [];
          if (_.isArray(criteriaProperties)) {
            criteriaPropertiesArray = criteriaProperties;
          } else {
            criteriaPropertiesArray = criteriaProperties.split(',');
          }
          var propertyMatch = _.find(criteriaPropertiesArray, function(property) {
            return property === $stateParams.property;
          });
          if (propertyMatch) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    function checkDateRestrictions(campaign) {
      if (campaign.criteria.bookingsFrom || campaign.criteria.bookingsUntil) {
        if ($stateParams.dates) {
          var bookedDate = $stateParams.dates.split('_');
          if (bookedDate && bookedDate.length) {
            var bookingFromDate = parseInt($window.moment.tz(bookedDate[0], Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
            var bookingToDate = parseInt($window.moment.tz(bookedDate[1], Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
            var criteriaFromDate = parseInt($window.moment.tz($window.moment(campaign.criteria.bookingsFrom).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
            var criteriaToDate = parseInt($window.moment.tz($window.moment(campaign.criteria.bookingsUntil).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
            if (bookingFromDate >= criteriaFromDate && bookingToDate <= criteriaToDate) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    function checkMemberOnly(campaign, loggedIn) {
      if (campaign.criteria.memberOnly === loggedIn) {
        return true;
      } else {
        return false;
      }
    }

    function checkActiveDates(campaign) {
      var today = parseInt($window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
      var fromDate = parseInt($window.moment.tz($window.moment(campaign.active.from).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
      var toDate = parseInt($window.moment.tz($window.moment(campaign.active.to).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());

      if (fromDate || toDate) {
        if (fromDate <= today && toDate >= today) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    function renderCampaign(campaign) {
      $rootScope.campaign = campaign ? campaign : $rootScope.campaign;

      //Build the campaign URL and add to scope
      addCampaignUrl();

      if($rootScope.campaign.sideRails && $rootScope.campaign.sideRails.railImage.uri)
      {
        $rootScope.campaign.sideRails.display = true;
      }

      //If a campaign isn't saved or if it is but we aren't on an offer page, display the campaign items
      if(!savedCampaign || (savedCampaign && !$stateParams.code))
      {
        if(!$rootScope.campaign.sideRails.display && $rootScope.campaign.pageCurl && $rootScope.campaign.pageCurl.images.uri) {
          $rootScope.campaign.pageCurl.display = true;
          $('body').addClass('campaign-folded-corner-active');
        }

        if($rootScope.campaign.interstitialAdvert && $rootScope.campaign.interstitialAdvert.images.uri) {
          $rootScope.campaign.interstitialAdvert.display = true;
        }

        if($rootScope.campaign.headerBar){
          $rootScope.campaign.headerBar.display = true;
        }

        if($rootScope.campaign.bookingBar) {
          $rootScope.campaign.bookingBar.display = true;
        }

        if ($rootScope.campaign.interstitialAdvert.display) {
          if (savedCampaign) {
            if (!savedCampaign.interstitialDismissed) {
              modalService.openCampaignDialog($rootScope.campaign);
            }
          } else {
            modalService.openCampaignDialog($rootScope.campaign);
          }
        }
      }

      //Add new campaign cookie
      if (savedCampaign) {
        if (savedCampaign.code !== campaign.code) {
          addCampaignCookie($rootScope.campaign);
        }
      } else {
        addCampaignCookie($rootScope.campaign);
      }

      //Update booking bar with params
      $timeout(function() {
        // TODO: Check other code types
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', $stateParams);
      }, 0);

    }

    function addCampaignUrl() {
      if ($rootScope.campaign.association) {
        var offerCode = $rootScope.campaign.association.offerCode;
        var propertyCode = $rootScope.campaign.association.propertyCode;
        var contentCode = $rootScope.campaign.association.contentCode;

        if (offerCode && propertyCode) {
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
        } else if (offerCode) {
          $rootScope.campaign.uri = $state.href('offers', {
            code: offerCode
          });
        } else if (propertyCode) {
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
        } else if (contentCode) {
          contentService.getStatic().then(function(response) {
            var staticContent = _.find(response, function(item) {
              return item.code === contentCode;
            });
            if (staticContent) {
              var slug = staticContent.meta.slug;
              var codeStartIndex = slug.lastIndexOf('-');
              slug = slug.substring(0, codeStartIndex);
              $rootScope.campaign.uri = $state.href('staticContent', {
                contentSlug: slug
              });
            }
          });
        }
      }
    }

    function addCampaignCookie(campaign) {
      var isPriority = campaign.criteria.bookingsFrom || campaign.criteria.bookingsUntil ? true : false;
      var campaignCookie = {
        'id': campaign.id,
        'code': campaign.code,
        'interstitialDismissed': false,
        'priority': isPriority
      };
      $window.document.cookie = 'ActiveCampaign' + '=' + angular.toJson(campaignCookie) + '; path=/';
    }

    // Public methods
    return {
      setCampaigns: setCampaigns
    };
  });
