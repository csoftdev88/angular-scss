'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.contacts', [])

  .controller('ContactsCtrl', function($scope, $controller, chainService, Settings, breadcrumbsService){

    $controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Contact And Feedback');

    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;
    });

    $scope.sendForm = function(){
      $scope.form.$submitted = true;
      if ($scope.form.$valid) {
        //send data to API here
        $scope.form.$setPristine();
      }
    };
  });
