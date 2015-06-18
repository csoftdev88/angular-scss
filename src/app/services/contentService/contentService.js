'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.content', [])
.service( 'contentService',  function(apiService, Settings) {
  function getNews(){
    return apiService.get(apiService.getFullURL('contents'), {filter: 'news', chainCode: Settings.API.chainCode});
  }

  function getAbout(){
    return apiService.get(apiService.getFullURL('contents'), {filter: 'about'});
  }

  function getOffers(){
    return apiService.get(apiService.getFullURL('contents'), {filter: 'specialOffer'});
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
    getHighlightedItems: getHighlightedItems,
    // Generics
    getCurrencies: getCurrencies,
    getLanguages: getLanguages,
  };
});
