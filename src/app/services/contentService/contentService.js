'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.content', [])
.service( 'contentService',  function($q, apiService, $filter, _) {
  function getNews(){
    return apiService.getThrottled(apiService.getFullURL('contents.news'));
  }

  function getAbout(){
    return apiService.getThrottled(apiService.getFullURL('contents.about'));
  }

  function getStatic(){
    return apiService.getThrottled(apiService.getFullURL('contents.static'));
  }

  function getOffers(parameters){
    return apiService.getThrottled(apiService.getFullURL('contents.offers'), parameters);
  }

  function getAdverts(parameters){
    var q = $q.defer();
    apiService.get(apiService.getFullURL('contents.adverts.adverts'),
      parameters).then(function(data){
         // NOTE: API doesnt properly filter images by their bannerSize
        // if requested with bannerSize query param. More details PT#101113466
        if(parameters && parameters.bannerSize){
          _.each(data, function(advert){
            advert.images = _.filter(advert.images, {bannerSize: parameters.bannerSize});
          });
        }

        q.resolve(data);
      }, function(error){
        q.reject(error);
      });

    return q.promise;
  }

  function getRandomAdvert(parameters){
    var q = $q.defer();

    apiService.get(apiService.getFullURL('contents.adverts.random'),
      parameters).then(function(advert){
        // More details PT#101113466
        if(parameters && parameters.bannerSize){
          advert.images = _.filter(advert.images, {bannerSize: parameters.bannerSize});
        }

        q.resolve(advert);
      }, function(error){
        q.reject(error);
      });

    return q.promise;
  }

  // Generics
  function getCurrencies(){
    return apiService.get(apiService.getFullURL('generics.currencies'));
  }

  function getLanguages(){
    return apiService.get(apiService.getFullURL('generics.languages'));
  }

  function getCountries(){
    return apiService.get(apiService.getFullURL('generics.countries'));
  }

  function getCountryByID(countryId, countryList){
    var countryMatch = null;
    _.each(countryList, function(country){
      if(country.id === countryId){
        countryMatch = country;
      }
    });
    return countryMatch;
  }

  function getCountryByCode(code, countries) {
    return _.find(countries, function(country) {
      return country.code === code;
    });
  }

  function getTitles(){
    return apiService.get(apiService.getFullURL('generics.titles'));
  }

  function getContactMethods(){
    return apiService.get(apiService.getFullURL('generics.contactmethods'));
  }

  function getLightBoxContent(images, width, height, fill){
    var isFormatingRequred = width && height && fill;

    return images.map(function(img){
      return {
        // NOTE: Reducing the size of images
        uri:  isFormatingRequred? $filter('cloudinaryImage')(img.uri, width, height, fill) : img.uri,
        title: img.imageName || img.alt,
        subtitle: img.alt
      };
    });
  }

  // Public methods
  return {
    getNews: getNews,
    getAbout: getAbout,
    getStatic: getStatic,
    getOffers: getOffers,
    getAdverts: getAdverts,
    getRandomAdvert: getRandomAdvert,
    // Generics
    getCurrencies: getCurrencies,
    getLanguages: getLanguages,
    getTitles: getTitles,
    getContactMethods: getContactMethods,
    getLightBoxContent: getLightBoxContent,
    getCountries: getCountries,
    getCountryByID: getCountryByID,
    getCountryByCode: getCountryByCode
  };
});
