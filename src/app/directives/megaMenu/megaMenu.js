'use strict';

angular.module('mobiusApp.directives.megaMenu', [])

.directive('megaMenu', function(propertyService, locationService, $cacheFactory, _, $state, $rootScope){
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
      scope.isBookingWidget = attrs.type === 'booking-widget';
      //scope.activeRegionCode = '';
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
      var megaMenuCache = $cacheFactory.get('megaMenuCache') || $cacheFactory('megaMenuCache');
      
      //Get Regions
      locationService.getRegions().then(function(regions){
        megaMenuCache.put('regions', regions);
        //console.log('megaMenuCache regions: ' + angular.toJson(megaMenuCache.get('regions')));
        scope.regionsLoading = false;
        scope.regions = regions;
      });

      scope.getLocations = function(regionIndex){

        scope.locationsLoading = true;
        scope.activeRegion = scope.regions[regionIndex];
        //scope.activeRegionCode = scope.regions[regionIndex].code;

        if(megaMenuCache.get('regions')[regionIndex].locations){
          scope.locationsLoading = false;
          scope.locations = megaMenuCache.get('regions')[regionIndex].locations;
        }
        else{
          locationService.getLocations().then(function(locations){
            //console.log('megaMenuCache locations: ' + angular.toJson(locations));
            //Cache current region's locations
            megaMenuCache.get('regions')[regionIndex].locations = _.where(locations, {regionCode: scope.activeRegion.code});
            //console.log('megaMenuCache regions with locations: ' + angular.toJson(megaMenuCache.get('regions')[regionIndex]));

            //Get properties and filter by locationCode
            propertyService.getAll().then(function(properties){
              _.each(megaMenuCache.get('regions')[regionIndex].locations, function(cachedLocation, index){
                megaMenuCache.get('regions')[regionIndex].locations[index].properties = _.where(properties, {locationCode: cachedLocation.code});
              });
              //console.log('megaMenuCache regions with locations with properties: ' + angular.toJson(megaMenuCache.get('regions')[regionIndex]));
            });
            scope.locationsLoading = false;
            scope.locations = megaMenuCache.get('regions')[regionIndex].locations;
          });
        }
      };

      //Main menu open/close
      scope.closeMenu = function(){
        megaMenu.addClass('closed');
      };
      scope.showMenu = function(){
        megaMenu.removeClass('closed');
      };

      scope.locationClick = function(region, location){
        //main menu
        if(attrs.type !== 'booking-widget'){
          scope.closeMenu();
          $state.go('hotels', {regionSlug: region.meta.slug, locationSlug: location.meta.slug});
        }
        //booking widget
        else{
          //nothing on location click
        }
      };

      scope.propertyClick = function(property){
        //main menu
        if(attrs.type !== 'booking-widget'){
          scope.closeMenu();
          $state.go('hotel', {propertySlug: property.meta.slug});
        }
        //booking widget
        else{
          megaMenu.removeClass('open');
          $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
            property: property
          });

        }
      };
    }
  };
});
