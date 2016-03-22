'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.prestige', [])

  .controller('PrestigeCtrl', function($scope, breadcrumbsService, scrollService, $timeout, stateService, apiService, userObject, $window, $controller, user, $state) {

    //check if user is logged in
    function onAuthorized(){
      if(!user.isLoggedIn()){
        $state.go('home');
      }
      else{
        breadcrumbsService.addBreadCrumb('Sutton Prestige');
        $scope.viewMode = 'recent';
        apiService.get(apiService.getFullURL('customers.transactions', {customerId: userObject.id})).then(function(data){
          $scope.prestigeData = data;
        });
      }
    }
    $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});

    //Scroll to top of page
    function scrollToTop(){
      $timeout(function () {
        scrollService.scrollTo('prestige-account', 20);
      });
    }
    scrollToTop();

    $scope.onPageChange = function(){
      scrollToTop();
    };
    
    //Detect mobile
    $scope.isMobile = function(){
      return stateService.isMobile();
    };

    //format dates
    $scope.formatDate = function(date, format){
      return $window.moment(date).format(format);
    };

  });
