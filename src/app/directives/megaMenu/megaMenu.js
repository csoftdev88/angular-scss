'use strict';

angular.module('mobiusApp.directives.megaMenu', [])

.directive('megaMenu', function(propertyService, locationService, _, $state, $rootScope, contentService, Settings, funnelRetentionService, $filter) {
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/megaMenu/megaMenu.html',

    // Widget logic goes here
    link: function(scope, elem, attrs) {

      var megaMenu = angular.element(elem).find('.mega-menu');
      scope.regionsLoading = true;
      scope.locationsLoading = false;
      scope.showLocationsPlaceholder = true;

      //Set main menu text
      scope.title = attrs.title;
      scope.type = attrs.type;
      scope.isBookingWidget = attrs.type === 'booking-widget';
      scope.isHotels = attrs.type === 'hotels';
      scope.isHotDeals = attrs.type === 'hot-deals';
      scope.activeRegion = {};
      //external region links
      scope.externalRegionLinks = Settings.UI.menu.externalRegionLinks;


      //boooking-widget version style and event listeners
      if (attrs.type === 'booking-widget') {
        angular.element(elem).addClass('booking-widget');
        var input = $('#booking-widget-property-megamenu');
        //show mega menu on input focus
        input.focus(function() {
          megaMenu.addClass('open');
        });
        //Hide mega menu on click outside of it
        $(document).mouseup(function(e) {
          if (!megaMenu.is(e.target) && !input.is(e.target) && megaMenu.has(e.target).length === 0) {
            megaMenu.removeClass('open');
          }
        });
      }


      //Get Regions
      locationService.getRegions().then(function(regions) {
        //megaMenuCache.put('regions', regions);
        scope.regionsLoading = false;
        scope.regions = _.sortBy(regions, 'nameShort');
        scope.getLocationsProperties(scope.regions);
      });

      scope.getLocationsProperties = function(regions) {
        scope.locationsLoading = true;
        locationService.getLocations().then(function(locations) {
          //Get properties and filter by locationCode
          propertyService.getAll().then(function(properties) {

            //If enabled, sort properties by their chain code, then alphabetically in each group
            if (Settings.UI.generics.orderPropertiesByChain && Settings.UI.chains.length > 1) {
              var sortedProperties = [];
              _.each(Settings.UI.chains, function(chain) {
                var chainProperties = _.filter(properties, function(property) {
                  return property.chainCode === chain;
                });
                chainProperties = _.sortBy(chainProperties, 'nameShort');
                sortedProperties = sortedProperties.concat(chainProperties);
              });
              properties = sortedProperties;
            }
            //or just alphabetically
            else {
              properties = _.sortBy(properties, 'nameShort');
            }

            //Hot deals logic found here: https://2pventures.tpondemand.com/entity/12353
            //if hot deals, remove properties that don't have hot deals
            if (scope.isHotDeals) {
              //get offers
              contentService.getOffers().then(function(offers) {
                //only keep offers that have at least 1 property in availability
                offers = _.filter(offers, function(offer) {
                  return offer.offerAvailability && offer.offerAvailability.length;
                });

                //only include properties that have an offer associated with them
                var filteredProperties = [];
                _.each(properties, function(property) {
                  _.each(offers, function(offer) {
                    _.each(offer.offerAvailability, function(availability) {
                      if (property.code === availability.property) {
                        if (!_.contains(filteredProperties, property)) {
                          filteredProperties.push(property);
                        }
                      }
                    });
                  });
                });
                _.each(regions, function(region) {
                  region.locations = _.where(locations, {
                    regionCode: region.code
                  });
                  assignPropertiesToLocations(region, _.uniq(filteredProperties));
                });
              });
            } else {
              _.each(regions, function(region) {
                region.locations = _.where(locations, {
                  regionCode: region.code
                });
                assignPropertiesToLocations(region, _.uniq(properties));
              });
            }
          });
        });
      };

      //Main menu open/close
      scope.closeMenu = function() {
        megaMenu.addClass('closed');
      };
      scope.showMenu = function() {
        /*if(scope.activeRegion.length > 0)
        {
          scope.getLocations(scope.activeRegion);
        }*/
        megaMenu.removeClass('closed');
      };

      scope.isActive = function() {
        //hotels menu
        if (attrs.type === 'hotels') {
          return $state.includes('hotels') || $state.includes('hotel') || $state.includes('regions') || $state.includes('hotelInfo');
        }
        //hot deals
        else if (attrs.type === 'hot-deals') {
          return $state.includes('hotDeals');
        }
      };

      scope.regionSelect = function(selectedRegion) {
        scope.activeRegion = selectedRegion;
        scope.showLocationsPlaceholder = false;
      };

      scope.getMenuUrl = function() {
        if (attrs.type === 'hotels') {
          return $state.href('regions', {
            regionSlug: null,
            property: null,
            location: null
          });
        } else if (attrs.type === 'hot-deals') {
          return $state.href('hotDeals', {
            regionSlug: null,
            locationSlug: null,
            code: null,
            property: null,
            location: null
          });
        }
      };

      scope.goToMenuUrl = function($event){
        $event.preventDefault();
        if (attrs.type === 'hotels') {
          $state.go('regions', {
            regionSlug: null,
            property: null,
            location: null
          });
        } else if (attrs.type === 'hot-deals') {
          $state.go('hotDeals', {
            regionSlug: null,
            locationSlug: null,
            code: null,
            property: null,
            location: null
          });
        }
        scope.closeMenu();
        scope.retentionClick();
      };

      scope.regionClick = function(region) {
        //hotels menu
        if (attrs.type === 'hotels') {
          scope.closeMenu();
          $state.go('regions', {
            regionSlug: region.meta.slug,
            property: null,
            location: null
          });
        }
      };

      scope.locationClick = function(location) {
        //hotels or hot deals
        if (attrs.type === 'hotels') {
          scope.closeMenu();
        }
        //booking widget
        else if (attrs.type === 'booking-widget') {
          megaMenu.removeClass('open');
          $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
            location: location.code,
            keepPromoCode: true
          });
        }
      };

      scope.propertyClick = function($event, property) {
        //hotels or hot deals
        if (attrs.type === 'hotels' || attrs.type === 'hot-deals') {
          scope.closeMenu();
        }
        //booking widget
        else if (attrs.type === 'booking-widget') {
          $event.preventDefault();
          megaMenu.removeClass('open');
          $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
            property: property.code,
            keepPromoCode: true
          });
        }
      };

      scope.selectAllHotelsClick = function() {
        if (attrs.type === 'booking-widget') {
          megaMenu.removeClass('open');
          $rootScope.$broadcast('BOOKING_BAR_SELECT_ALL');
        }
      };

      scope.retentionClick = function(){
        funnelRetentionService.retentionClickCheck();
      };

      scope.filterProperties = function(regions, propertySearch){
        _.each(regions, function(region){
          _.each(region.locations, function(location) {
            location.filteredProperties = $filter('byNameOrZip')(location.properties, propertySearch, false);
            location.show = location.filteredProperties.length ? true : false;
          });
        });
      };

      function assignPropertiesToLocations(region, properties) {
        //assign properties to their respective location
        _.each(region.locations, function(location) {
          location.url = getLocationUrl(location, region);
          location.properties = _.where(properties, {
            locationCode: location.code
          });
          _.each(location.properties, function(property) {
            setPropertyUrls(property, location, region);
          });
          location.filteredProperties = location.properties;
          location.show = location.filteredProperties.length ? true : false;
        });
        scope.locationsLoading = false;
      }

      function getLocationUrl(location, region) {
        var paramsData = {
          'locationSlug': location.meta.slug,
          'regionSlug': region.meta.slug,
          'property': null,
          'propertySlug': null
        };
        return $state.href('hotels', paramsData, {
          reload: true
        });
      }

      function setPropertyUrls(property, location, region) {
        var paramsData = {
          'code': null,
          'locationSlug': location.meta.slug,
          'regionSlug': region.meta.slug,
          'property': property.code,
          'propertySlug': property.meta.slug
        };

        property.url = $state.href('hotel', paramsData, {
          reload: true
        });
        property.hotDealsUrl = $state.href('propertyHotDeals', paramsData, {
          reload: true
        });
      }
    }
  };
});
