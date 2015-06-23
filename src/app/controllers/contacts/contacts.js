'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.contacts', [])

  .controller('ContactsCtrl', function($scope, $controller, chainService, Settings){

    $controller('MainCtrl', {$scope: $scope});

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
