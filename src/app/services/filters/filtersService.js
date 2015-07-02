'use strict';
/*
* This service gets available filters from the API
*/
angular.module('mobiusApp.services.filters', [])
.service( 'filtersService',  function($window, $q, apiService, Settings) {
  var store = {};

  function getProducts(useCache){
    var q = $q.defer();

    if(useCache && store.products){
      q.resolve(store.products);
    }else{
      apiService.get(apiService.getFullURL('filters.products')).then(function(data){
        store.products = data;
        q.resolve(data);
      }, function(error){
        q.reject(error);
      });
    }

    return q.promise;
  }

  function getRooms(){
    return apiService.get(apiService.getFullURL('filters.rooms'));
  }

  function getBestRateProduct(){
    var q = $q.defer();

    getProducts(true).then(function(products){
      q.resolve($window._.find(products, {code: Settings.defaultProductRateCode}));
    }, function(){
      q.resolve(null);
    });
    return q.promise;
  }

  // Public methods
  return {
    getProducts: getProducts,
    getRooms: getRooms,
    getBestRateProduct: getBestRateProduct
  };
});
