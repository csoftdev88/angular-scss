'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.content', [])
.service( 'contentService',  function(apiService) {
  function getNews(){
    return apiService.get(apiService.getFullURL('contents.news'));
  }

  function getAbout(){
    return apiService.get(apiService.getFullURL('contents'), {filter: 'about'});
  }

  function getOffers(parameters){
    return apiService.get(apiService.getFullURL('contents.offers'), parameters);
  }

  function getRandomAdvert(bannerSize){
    return apiService.get(apiService.getFullURL('contents.adverts.random'),
      {bannerSize: bannerSize});
  }

  function getHighlightedItems(){
    return apiService.get(apiService.getFullURL('contents'), {filter: 'news'});
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
    getRandomAdvert: getRandomAdvert,
    getHighlightedItems: getHighlightedItems,
    // Generics
    getCurrencies: getCurrencies,
    getLanguages: getLanguages
  };
});
