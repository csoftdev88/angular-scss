/*
 * This module controlls offers page
 */
(function () {
  'use strict';

  angular
    .module('mobius.controllers.prestige', [])
    .controller('PrestigeCtrl', Prestige);

  function Prestige($scope, breadcrumbsService, scrollService, $timeout, stateService, apiService, $window,
                    $controller, $state, user, Settings) {

    $scope.dataLoaded = false;

    //check if user is logged in
    function onAuthorized() {
      if ($scope.auth && !$scope.auth.isLoggedIn()) {
        $state.go('home');
      }
      else {
        breadcrumbsService.addBreadCrumb('Prestige');
        apiService.get(apiService.getFullURL('customers.transactions', { customerId: user.getUser().id }))
          .then(function(data) {
            $scope.viewMode = 'recent';
            $scope.prestigeData = data;
            $scope.dataLoaded = true;
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

    $scope.switchView = function(view){
      $scope.viewMode = view;
    };

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

    $scope.config = Settings.UI.viewsSettings.prestige;

  }

}());
