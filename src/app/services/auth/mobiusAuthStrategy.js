'use strict';

angular.module('mobiusApp.services.auth', [])

  .service( 'mobiusAuthStrategy', function($rootScope, $q, $timeout, user, apiService, Settings) {

    var login = function () {

    };

    var logout = function () {
      $rootScope.$evalAsync(function(){
        userObject = {};
        $state.go('home', {}, {reload: true});

      });
      // Removing auth headers
      var headers = {};
      headers[HEADER_INFINITI_SSO] = undefined;
      apiService.setHeaders(headers);
      user.clearStoredUser();

      user.authPromise = $q.defer();

      $timeout(function(){
        $rootScope.$broadcast('MOBIUS_USER_LOGIN_EVENT');
      });
    };

    var isLoggedIn = function () {
      $rootScope.showLoginDialog = !$rootScope.showLoginDialog;
    };

    return {
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn()
    };

  });
