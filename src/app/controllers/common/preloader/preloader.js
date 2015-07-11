'use strict';
/*
 * This module contains methods for app preloader and listens
 * for event preloader events broadcasted by preloaderFactory
 */
angular.module('mobius.controllers.common.preloader', [])

.controller( 'PreloaderCtrl', function($scope) {
  var EVENT_PRELOADER = 'EVENT_PRELOADER';

  $scope.preloader = {
    show: function(){
      $scope.preloader.visible = true;
    },

    hide: function(){
      $scope.preloader.visible = false;
    }
  };

  $scope.$on(EVENT_PRELOADER, function($event, data){
    if(data.visibility){
      $scope.preloader.show();
    }else{
      $scope.preloader.hide();
    }
  });
});
