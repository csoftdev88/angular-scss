'use strict';

angular.module('mobiusApp.directives.megaMenu', [])

.directive('megaMenu', function(propertyService, locationService, $cacheFactory, _, $state, $rootScope, contentService, Settings){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/megaMenu/megaMenu.html',

    // Widget logic goes here
    link: function(scope, elem, attrs){

      var megaMenu = angular.element(elem).find('.mega-menu');
      scope.regionsLoading = true;
      scope.locationsLoading = false;

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
      if(attrs.type === 'booking-widget'){
        angular.element(elem).addClass('booking-widget');
        var input = $('#booking-widget-property-megamenu');
        //show mega menu on input focus
        input.focus(function(){
          megaMenu.addClass('open');
        });
        //Hide mega menu on click outside of it
        $(document).mouseup(function(e){
          if (!megaMenu.is(e.target) && !input.is(e.target) && megaMenu.has(e.target).length === 0){
            megaMenu.removeClass('open');
          }
        });
      }

      //megamenu cache
      var megaMenuCache = $cacheFactory.get(attrs.type) || $cacheFactory(attrs.type);

      //Get Regions
      locationService.getRegions().then(function(regions){
        megaMenuCache.put('regions', regions);
        scope.regionsLoading = false;
        scope.regions = _.sortBy(regions, 'nameShort');
      });

      scope.getLocations = function(regionIndex){
        scope.locationsLoading = true;
        scope.activeRegion = scope.regions[regionIndex];

        locationService.getLocations().then(function(locations){
          //Cache current region's locations
          megaMenuCache.get('regions')[regionIndex].locations = _.where(locations, {regionCode: scope.activeRegion.code});

          //Get properties and filter by locationCode
          propertyService.getAll().then(function(properties){

            //If enabled, sort properties by their chain code, then alphabetically in each group
            if(Settings.UI.generics.orderPropertiesByChain && Settings.UI.chains.length > 1){
              var sortedProperties = [];
              _.each(Settings.UI.chains, function(chain){
                var chainProperties = _.filter(properties, function(property){ return property.chainCode === chain; });
                chainProperties = _.sortBy(chainProperties, 'nameShort');
                sortedProperties = sortedProperties.concat(chainProperties);
              });
              properties = sortedProperties;
            }
            //or just alphabetically
            else{
              properties = _.sortBy(properties, 'nameShort');
            }

            //if hot deals, remove properties that don't have hot deals
            if(scope.isHotDeals){
              //get offers
              contentService.getOffers().then(function(offers) {
                //only keep offers that have at least 1 property in availability
                offers = _.filter(offers, function(offer){ return offer.offerAvailability && offer.offerAvailability.length;});

                //only include properties that have an offer associated with them
                var filteredProperties = [];
                _.each(properties, function(property){
                  _.each(offers, function(offer){
                    _.each(offer.offerAvailability, function(availability){
                      if(property.code === availability.property && availability.featured){
                        filteredProperties.push(property);
                      }
                    });
                  });
                });

                assignPropertiesToLocations(regionIndex, _.uniq(filteredProperties));

              });
            }
            else{
              assignPropertiesToLocations(regionIndex, _.uniq(properties));
            }

          });

        });
      };

      function assignPropertiesToLocations(regionIndex, properties){
        //assign properties to their respective location
        _.each(megaMenuCache.get('regions')[regionIndex].locations, function(cachedLocation, index){
          megaMenuCache.get('regions')[regionIndex].locations[index].properties = _.where(properties, {locationCode: cachedLocation.code});
        });

        scope.locationsLoading = false;
        scope.locations = megaMenuCache.get('regions')[regionIndex].locations;
      }

      //Main menu open/close
      scope.closeMenu = function(){
        megaMenu.addClass('closed');
      };
      scope.showMenu = function(){
        if(scope.activeRegion.length > 0)
        {
          scope.getLocations(scope.activeRegion);
        }
        megaMenu.removeClass('closed');
      };
      scope.isActive = function(){
        //hotels menu
        if(attrs.type === 'hotels'){
          return $state.includes('hotels') || $state.includes('hotel') || $state.includes('regions') || $state.includes('hotelInfo');
        }
        //hot deals
        else if(attrs.type === 'hot-deals'){
          return $state.includes('hotDeals');
        }
      };

      scope.menuClick = function(){
        //hotels menu
        if(attrs.type === 'hotels'){
          $state.go('regions', {regionSlug: null, property: null, location: null});
        }
        //hot deals
        else if(attrs.type === 'hot-deals'){
          $state.go('hotDeals', {locationSlug: null, code: null, property: null, location: null});
        }
      };

      scope.locationClick = function(region, location){
        //hotels menu
        if(attrs.type === 'hotels'){
          scope.closeMenu();
          $state.go('hotels', {regionSlug: region.meta.slug, locationSlug: location.meta.slug, property: null, location: location.code});
        }
        //hot deals
        else if(attrs.type === 'hot-deals'){
          scope.closeMenu();
          $state.go('hotDeals', {regionSlug: region.meta.slug, locationSlug: location.meta.slug, code: null, property: null, location: null});
        }
        //booking widget
        else if(attrs.type === 'booking-widget'){
          megaMenu.removeClass('open');
          $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
            location: location.code
          });
        }
      };

      scope.propertyClick = function(region, location, property){
        //hotels menu
        if(attrs.type === 'hotels'){
          scope.closeMenu();

          var params = {
            propertySlug: property.meta.slug,
            property: property.code,
            location: null
          };

          if(Settings.UI.hotelDetails.includeLocationInUrl){
            params.regionSlug = region.meta.slug;
            params.locationSlug = location.meta.slug;
          }

          $state.go('hotel', params);

        }
        //hot deals
        else if(attrs.type === 'hot-deals'){
          scope.closeMenu();
          $state.go('hotDeals', {regionSlug: region.meta.slug, locationSlug: location.meta.slug, propertySlug: property.meta.slug, property: null, location: null});
        }
        //booking widget
        else if(attrs.type === 'booking-widget'){
          megaMenu.removeClass('open');
          $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
            property: property.code
          });
        }
      };
    }
  };
});
