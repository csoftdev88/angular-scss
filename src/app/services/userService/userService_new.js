(function() {
  'use strict';

  /**
   * Service to get and set registered users information such as currency, loyalty points etc.
   * The service at run time will pick a strategy to use based on the auth type.
   *
   * @see mobiusUserStrategy
   * @see infinitiUserStrategy
   * @see keystoneUserStrategy
   * @author Bryan Kneis
   */
  angular
    .module('mobiusApp.services.user_new', [
      'mobiusApp.services.mobiusUserStrategy',
      'mobiusApp.services.infinitiUserStrategy',
      'mobiusApp.services.keystoneUserStrategy'
    ])
    .service( 'user_new', userService);

  function userService(_, mobiusUserStrategy, infinitiUserStrategy, keystoneUserStrategy, Settings, $log) {

    // ViewModel
    var vm = this;
    // The auth strategy to use, it will be assigned to one of the <type>AuthStrategy services
    var strategy;

    // Function to ensure a strategy has the correct functions. As js does not have interfaces we need
    // to check at run time if the object is valid, otherwise a type error will be thrown
    var isValidStrategy = function(strategy) {
      var fns = [
        'getProfileUrl',
        'openLogin',
        'getUser',
        'loadProfile',
        'getCustomerId',
        'loadLoyalties',
        'loadRewards',
        'updateUser',
        'authPromise',
        'storeUserLanguage',
        'getUserLanguage',
        'storeUserId',
        'getStoredUser',
        'clearStoredUser',
        'storeUserCurrency',
        'getUserCurrency'
      ];
      var valid = true;
      for (var fn in fns) {
        if (_.isFunction(strategy[fn])) {
          valid = false;
          break;
        }
      }
      return valid;
    };

    // Based on the auth type set in Settings.authType choose a strategy object to use
    // so functions to the userService are proxied to the correct service
    var setStrategy = function () {
      switch (Settings.authType) {
        case ('mobius'):
          strategy = mobiusUserStrategy;
          break;
        case ('infiniti'):
          strategy = infinitiUserStrategy;
          break;
        case ('keystone'):
          strategy = keystoneUserStrategy;
          break;
        default:
          $log.warn('The application has been configured without a valid auth type!!');
          break;
      }
      vm.authPromise = strategy.authPromise;
      if (!isValidStrategy(strategy)) {
        $log.warn('The application has been configured with an invalid auth strategy');
      }
    };

    var init = function () {
      // Set the auth strategy if it has not been set yet
      if (!strategy) {
        setStrategy();
      }
    };
    init();

    // ---- USER FUNCTIONS -----
    vm.getProfileUrl = function () {
      if (strategy) {
        return strategy.getProfileUrl();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.openLogin = function () {
      if (strategy) {
        return strategy.openLogin();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.getUser = function() {
      if (strategy) {
        return strategy.getUser();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.loadProfile = function() {
      if (strategy) {
        return strategy.loadProfile();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.getCustomerId = function() {
      if (strategy) {
        return strategy.getCustomerId();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.loadLoyalties = function(customerId) {
      if (strategy) {
        return strategy.loadLoyalties(customerId);
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.loadRewards = function(customerId) {
      if (strategy) {
        return strategy.loadRewards(customerId);
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.updateUser = function() {
      if (strategy) {
        return strategy.updateUser();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.storeUserLanguage = function(language) {
      if (strategy) {
        return strategy.storeUserLanguage(language);
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.getUserLanguage = function() {
      if (strategy) {
        return strategy.getUserLanguage();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.storeUserId = function() {
      if (strategy) {
        return strategy.storeUserId();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.getStoredUser = function() {
      if (strategy) {
        return strategy.getStoredUser();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.clearStoredUser = function() {
      if (strategy) {
        return strategy.clearStoredUser();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.storeUserCurrency = function(currency) {
      if (strategy) {
        return strategy.storeUserCurrency(currency);
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    vm.getUserCurrency = function() {
      if (strategy) {
        return strategy.getUserCurrency();
      }
      $log.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

  }
}());
