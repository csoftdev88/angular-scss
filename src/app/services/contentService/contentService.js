'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.content', [])
.service( 'contentService',  function(apiService) {

  function getNews(){
    return apiService.get(apiService.getFullURL('content.news'));
  }

  function getAbout(){
    return apiService.get(apiService.getFullURL('content.abouts'));
  }

  function getOffers(){
    return apiService.get(apiService.getFullURL('content.offers'));
  }

    // Generics
  function getCurrencies(){
    return apiService.get(apiService.getFullURL('generics.currencies'));
  }

  function getLanguages(){
    return apiService.get(apiService.getFullURL('generics.languages'));
  }

  // Public methods
  return {
    getNews: getNews,
    getAbout: getAbout,
    getOffers: getOffers,
    // Generics
    getCurrencies: getCurrencies,
    getLanguages: getLanguages
  };
});
