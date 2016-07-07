'use strict';

angular.module('mobiusApp.services.router', [])
  .service('routerService', ['$q', 'propertyService', 'locationService', '_', function($q, propertyService, locationService, _) {

    
    function buildStateParams(state, paramsData){
      var q = $q.defer();
      var params = {};

      switch (state) {
        case 'hotels':
        case 'hotDeals':
          //Get region details
          locationService.getRegions().then(function(regions){
            var region = _.find(regions, function(region){ return region.code === paramsData.location.regionCode;});
            params.property = null;
            params.propertySlug = null;
            params.regionSlug = region.meta.slug;
            params.locationSlug = paramsData.location.meta.slug;
            q.resolve(params);
          });
          break;
        case 'hotel':
        case 'room':
        case 'propertyHotDeals':
          //Get region/location details
          propertyService.getPropertyRegionData(paramsData.property.locationCode).then(function(data){
            params.regionSlug = data.region.meta.slug;
            params.locationSlug = data.location.meta.slug;
            params.property = paramsData.property.code;
            params.propertySlug = paramsData.property.meta.slug;
            q.resolve(params);
          });
          break;
        case 'propertyOffers':
          //TODO: this is still Sutton logic, not relevant to Sandman atm, might need to change
          params.propertySlug = null;
          q.resolve(params);
          break;
        }

      return q.promise;
    }


    // Public methods
    return {
      buildStateParams: buildStateParams
    };
  }]);
