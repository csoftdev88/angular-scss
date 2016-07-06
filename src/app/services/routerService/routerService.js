'use strict';

angular.module('mobiusApp.services.router', [])
  .service('routerService', ['$q', 'propertyService', 'locationService', '_', function($q, propertyService, locationService, _) {

    
    function buildStateParams(state, property, location){
      var q = $q.defer();
      var params = {};

      switch (state) {
        case 'hotel':
          //Get region/location details
          propertyService.getPropertyRegionData(property.locationCode).then(function(data){
            params.regionSlug = data.region.meta.slug;
            params.locationSlug = data.location.meta.slug;
            params.propertySlug = property.meta.slug;
            q.resolve(params);
          });
          break;
        case 'hotels':
          //Get region details
          locationService.getRegions().then(function(regions){
            var region = _.find(regions, function(region){ return region.code === location.regionCode;});
            params.property = null;
            params.propertySlug = null;
            params.regionSlug = region.meta.slug;
            params.locationSlug = location.meta.slug;
            q.resolve(params);
          });
          break;
        }

      return q.promise;
    }


    // Public methods
    return {
      buildStateParams: buildStateParams
    };
  }]);
