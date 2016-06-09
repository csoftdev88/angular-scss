'use strict';

angular.module('mobiusApp.directives.megaMenu', [])

.directive('megaMenu', function(propertyService, locationService, $cacheFactory, _){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/megaMenu/megaMenu.html',

    // Widget logic goes here
    link: function(scope, elem, attrs){

      //Set main menu text
      scope.title = attrs.title;
      //scope.activeRegionCode = '';

      //megamenu cache
      var megaMenuCache = $cacheFactory.get('megaMenuCache') || $cacheFactory('megaMenuCache');
      
      //Get Regions
      locationService.getRegions().then(function(regions){
        megaMenuCache.put('regions', regions);
        //console.log('megaMenuCache regions: ' + angular.toJson(megaMenuCache.get('regions')));
        scope.regions = regions;
      });

      scope.getLocations = function(regionIndex){

        scope.activeRegion = scope.regions[regionIndex];
        //scope.activeRegionCode = scope.regions[regionIndex].code;

        if(megaMenuCache.get('regions')[regionIndex].locations){
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

            scope.locations = megaMenuCache.get('regions')[regionIndex].locations;
          });
        }
      };

      scope.closeMenu = function(){
        angular.element(elem).find('.mega-menu').addClass('closed');
      };
      scope.showMenu = function(){
        angular.element(elem).find('.mega-menu').removeClass('closed');
      };
    }
  };
});
