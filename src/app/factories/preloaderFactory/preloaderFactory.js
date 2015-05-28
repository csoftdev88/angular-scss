'use strict';

angular.module('mobiusApp.factories.preloader', [])

.factory('preloaderFactory', function($rootScope) {
  var EVENT_PRELOADER = 'EVENT_PRELOADER';

  function preloader(promise) {
    if(!promise || !promise.then){
      return;
    }

    broadcast(true);

    promise.then(function(){
      broadcast(false);
    }, function(){
      broadcast(false);
    });
  }

  function broadcast(visibility){
    $rootScope.$broadcast(EVENT_PRELOADER, {visibility: visibility});
  }

  // Public method
  return preloader;
});
