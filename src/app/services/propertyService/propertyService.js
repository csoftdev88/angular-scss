'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.properties', [])
.service( 'propertyService',  function($rootScope, $q, apiService, locationService, infinitiApeironService, _) {

  function correctParams(params) {
    if (params && (!params.from || !params.to || !params.adults || !params.productGroupId)) {
      delete params.from;
      delete params.to;
      delete params.adults;
      delete params.children;
      delete params.productGroupId;
    }
    return params;
  }

  function getAll(params){
    var q = $q.defer();
    apiService.getThrottled(apiService.getFullURL('properties.all'), correctParams(params)).then(function(propertyData){

      //If thirdparties system is active and properties are restricted, filter the returned property data
      if($rootScope.thirdparty && $rootScope.thirdparty.properties){
        var thirdPartyPropertyCodes = $rootScope.thirdparty.properties;
        if(thirdPartyPropertyCodes.length){
          var thirdPartyProperties = [];
          _.each(thirdPartyPropertyCodes, function(thirdPartyPropertyCode){
            var property = _.find(propertyData, function(property){
              return thirdPartyPropertyCode === property.code;
            });
            if(property){
              thirdPartyProperties.push(property);
            }
          });
          propertyData = thirdPartyProperties;
        }
      }
      q.resolve(propertyData);
    });

    return q.promise;
  }

  function getPropertyDetails(propertyCode, params){
    var URL = apiService.getFullURL('properties.details', {propertyCode: propertyCode});
    if (params && params.from && params.to) {
      infinitiApeironService.trackSearchParams();
    }
    return apiService.get(URL, correctParams(params));
  }

  function getPropertyRegionData(propertyLocationCode){
    var q = $q.defer();

    var regionData = {};

    locationService.getRegions().then(function(regions){
      locationService.getLocations().then(function(locations){

        var location = _.find(locations, function(location){ return location.code === propertyLocationCode;});
        var region = _.find(regions, function(region){ return region.code === location.regionCode;});

        regionData.location = location;
        regionData.region = region;

        q.resolve(regionData);

      });
    });

    return q.promise;
  }

  function getAvailability(propertyCode, params){
    var URL = apiService.getFullURL('properties.availability', {propertyCode: propertyCode});
    return apiService.get(URL, params);
  }

  function getAvailabilityOverview(propertyCode, params){
    var URL = apiService.getFullURL('properties.availabilityOverview', {propertyCode: propertyCode});
    return apiService.get(URL, params);
  }

  function getRooms(propertyCode){
    var URL = apiService.getFullURL('properties.room.all', {
      propertyCode: propertyCode
    });
    return apiService.get(URL);
  }

  function getRoomDetails(propertyCode, roomTypeCode){
    var URL = apiService.getFullURL('properties.room.details', {
      propertyCode: propertyCode,
      roomTypeCode: roomTypeCode
    });
    return apiService.get(URL);
  }

  function getRoomProducts(propertyCode, roomTypeCode, params, cacheTimeout){
    if(!params || !params.from || !params.to) {
      return $q.when({});
    }

    //Don't send voucher param to products requests
    delete params.voucher;

    var URL = apiService.getFullURL('properties.room.product.all', {
      propertyCode: propertyCode,
      roomTypeCode: roomTypeCode
    });

    // TODO: Caching should be done using URL without query params
    // Also, we might consider cleaning cache when booking criteria
    // are changed. TBD
    if(cacheTimeout){
      URL += '?' + apiService.objectToQueryParams(params);
      return apiService.getThrottled(URL, null, cacheTimeout);
    }

    return apiService.get(URL, params);
  }

  //Applying/Removing property chain class to body tag
  var currentChainClass = null;
  var currentPropertyClass = null;

  function applyPropertyChainClass(chainCode){
    removePropertyChainClass();
    var chainClass = ('chain-' + chainCode).toLowerCase();
    document.body.classList.add(chainClass);
    currentChainClass = chainClass;
  }

  function removePropertyChainClass(){
    document.body.classList.remove(currentChainClass);
    currentChainClass = null;
  }

  function applyPropertyClass(propertyCode){
    removePropertyClass();
    var propertyClass = ('property-' + propertyCode).toLowerCase();
    document.body.classList.add(propertyClass);
    currentPropertyClass = propertyClass;
  }

  function removePropertyClass(){
    document.body.classList.remove(currentPropertyClass);
    currentPropertyClass = null;
  }

  //Function to clean amenities by removing asterixes from names and hyphens from the beginning of slugs
  function sanitizeAmenities(amenities) {
    amenities = _.each(amenities, function (amenity) {
      amenity.name = amenity.name.replace('*', ''); //Remove asterix from name for display
      amenity.name = amenity.name.trim(); //Remove any remaining spaces at the beginning or end of name
      if (amenity.slug.charAt(0) === '-') { //If the amenity slug begins with a -
        amenity.slug = amenity.slug.substring(1); //Remove the first character of the slug string
      }
    });
    return amenities;
  }

  function highlightAsterixAmenities(amenities) {
    _.each(amenities, function (amenity) {
      amenity.highlight = amenity.name.indexOf('*') !== -1 ? true : false;
    });
  }

  // Public methods
  return {
    getAll: getAll,
    getPropertyDetails: getPropertyDetails,
    getPropertyRegionData: getPropertyRegionData,
    getAvailability: getAvailability,
    getAvailabilityOverview: getAvailabilityOverview,
    getRooms: getRooms,
    getRoomDetails: getRoomDetails,
    getRoomProducts: getRoomProducts,
    applyPropertyChainClass: applyPropertyChainClass,
    removePropertyChainClass: removePropertyChainClass,
    applyPropertyClass: applyPropertyClass,
    removePropertyClass: removePropertyClass,
    highlightAsterixAmenities: highlightAsterixAmenities,
    sanitizeAmenities: sanitizeAmenities
  };
});
